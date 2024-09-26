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
import {MatAccordion} from "@angular/material/expansion";
import {ToolInputExpansionPanelComponent} from "./ui-tool-inputs/tool-input-expansion-panel.component";
import {InputOptionService} from "../shared/data-access/input-option.service";
import {MatTooltip} from "@angular/material/tooltip";
import {ToolOutputExpansionPanelComponent} from "./ui-tool-outputs/tool-output-expansion-panel.component";

@Component({
  selector: 'app-tool-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    ToolInputListComponent,
    ToolOutputListComponent,
    ToolInputFormComponent,
    ToolOutputFormComponent,
    MatAccordion,
    ToolInputExpansionPanelComponent,
    MatTooltip,
    ToolOutputExpansionPanelComponent
  ],
  template: `
    <!-- Header -->
    @if (tool(); as tool) {
      <header>
        <button class="button-primary" routerLink="/home">< Back</button>

        <h1>Tool: {{ tool.name }}</h1>
      </header>
    }

    <!-- Lists -->
    <section>

      <div class="scrollable">
        <!-- Inputs header -->
        <div class="list-header">
          <h4>Tool inputs</h4>

          <button class="button-success small-button" (click)="toolInputBeingEdited.set({})"
                  matTooltip="Add tool input" matTooltipPosition="right">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>

        <!-- Inputs list -->
        <mat-accordion>
          @for (input of toolInputs(); track input.id) {
            <app-tool-input-expansion-panel
              [input]="input"
              [inputOptions]="inputOptionService.inputOptions()"

              (editInput)="toolInputBeingEdited.set($event)"
              (deleteInput)="toolInputService.remove$.next($event)"

              (addInputOption)="inputOptionService.add$.next($event)"
              (editInputOption)="inputOptionService.edit$.next($event)"
            />
          }
        </mat-accordion>
      </div>

      <div>
        <!-- Outputs header -->
        <div class="list-header">
          <h4>Tool outputs</h4>

          <button class="button-success small-button" (click)="toolOutputBeingEdited.set({})"
                  matTooltip="Add tool output" matTooltipPosition="right">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>

        <!-- Outputs list -->
        <mat-accordion>
          @for (output of toolOutputs(); track output.id) {
            <app-tool-output-expansion-panel
              [output]="output"

              (edit)="toolOutputBeingEdited.set($event)"
              (delete)="toolOutputService.remove$.next($event)"
            />
          }
        </mat-accordion>
      </div>

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

    <!-- ToolOutputForm modal -->
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

    .list-header {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;

      padding: .5rem 1rem;
      user-select: none;

      h4 {
        margin: 0;
      }
    }

    h1 {
      margin: 0;
      font-size: 1.8em;
    }

    section {
      height: 100%;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 1rem;
      padding: 1rem;
    }

    .scrollable {
      height: calc(100% - 50px);
      overflow-y: auto;
      background-color: lightyellow;
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
  protected inputOptionService: InputOptionService = inject(InputOptionService);

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
