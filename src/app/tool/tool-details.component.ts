import {Component, computed, inject, signal} from '@angular/core';
import {ToolService} from "./data-access/tool.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {JsonPipe} from "@angular/common";
import {ToolInputListComponent} from "./ui-tool-inputs/tool-input-list.component";
import {ToolInputService} from "./data-access/tool-input.service";
import {ToolInput, ToolOutput} from "../shared/interfaces";
import {ToolOutputService} from "./data-access/tool-output.service";
import {ToolOutputListComponent} from "./ui-tool-outputs/tool-output-list.component";
import {ToolInputFormComponent} from "./ui-tool-inputs/tool-input-form.component";
import {ToolOutputFormComponent} from "./ui-tool-outputs/tool-output-form.component";

@Component({
  selector: 'app-tool-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    ToolInputListComponent,
    ToolOutputListComponent,
    ToolInputFormComponent,
    ToolOutputFormComponent
  ],
  template: `
    <!-- Header -->
    @if (tool(); as tool) {
      <header>
        <button class="button-primary" routerLink="/application/{{tool.applicationId}}">< Back</button>

        <h1>Tool: {{ tool.name }}</h1>
      </header>
    }

    <!-- Lists -->
    <section>
      <!-- Inputs -->
      <app-tool-input-list
        class="half"
        [toolInputs]="toolInputs()"
        (add)="toolInputBeingEdited.set({})"
        (edit)="toolInputBeingEdited.set($event)"
        (delete)="toolInputService.remove$.next($event)"
      />

      <!-- Outputs -->
      <app-tool-output-list
        class="half"
        [toolOutputs]="toolOutputs()"
        (add)="toolOutputBeingEdited.set({})"
        (edit)="toolOutputBeingEdited.set($event)"
        (delete)="toolOutputService.remove$.next($event)"
      />
    </section>

    <!-- ToolInputForm modal -->
    <app-tool-input-form
      [inputBeingEdited]="toolInputBeingEdited()"
      (close)="toolInputBeingEdited.set(null)"
      (save)="
            toolInputBeingEdited()?.id
              ? toolInputService.edit$.next({
                id: toolInputBeingEdited()!.id!,
                data: $event
              })
              : toolInputService.add$.next({
                item: $event,
                toolId: tool()?.id!
              })
          "
    />

    <!-- ToolOutputForm modal TODO -->
    <app-tool-output-form
      [outputBeingEdited]="toolOutputBeingEdited()"
      (close)="toolOutputBeingEdited.set(null)"
      (save)="
            toolOutputBeingEdited()?.id
              ? toolOutputService.edit$.next({
                id: toolOutputBeingEdited()!.id!,
                data: $event
              })
              : toolOutputService.add$.next({
                item: $event,
                toolId: tool()?.id!
              })
          "
    />
  `,
  styles: [`
    header {
      display: flex;
      flex-flow: row nowrap;

      justify-content: space-between;
      align-items: center;

      padding: 0 1rem;

      border-bottom: 1px solid var(--color-dark);
    }

    h1 {
      margin: 0;
      font-size: 1.8em;
    }

    section {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 1rem;
      padding: 1rem;
    }
  `]
})
// Responsibility: Smart component in charge of showing a tool's details
// Get the tool by its id, get this id from the url parameters
export default class ToolDetailsComponent {

  // --- Dependencies
  protected toolService: ToolService = inject(ToolService);
  protected toolInputService: ToolInputService = inject(ToolInputService);
  protected toolOutputService: ToolOutputService = inject(ToolOutputService);

  private route: ActivatedRoute = inject(ActivatedRoute);


  // --- Properties
  public params = toSignal(this.route.paramMap);

  // Get the tool by the id in the url parameters
  public tool = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.toolService
      .tools()
      .find((tool) => tool.id === id);
  });


  // --- ToolInputs
  public toolInputs = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.toolInputService
      .toolInputs()
      .filter((toolInput) => toolInput.toolId == id)
  });

  // Track the toolInput that is currently being edited
  public toolInputBeingEdited = signal<Partial<ToolInput> | null>(null);


  // --- ToolOutputs
  public toolOutputs = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.toolOutputService
      .toolOutputs()
      .filter((toolOutput) => toolOutput.toolId == id)
  });

  // Track the toolInput that is currently being edited
  public toolOutputBeingEdited = signal<Partial<ToolOutput> | null>(null);
}
