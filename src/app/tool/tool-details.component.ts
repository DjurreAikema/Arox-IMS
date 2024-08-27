import {Component, computed, effect, inject, signal} from '@angular/core';
import {ToolService} from "./data-access/tool.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {JsonPipe} from "@angular/common";
import {ToolInputListComponent} from "./ui-tools/tool-input-list.component";
import {ToolInputService} from "./data-access/tool-input.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ToolInput, ToolOutput} from "../shared/interfaces";
import {FormModalComponent} from "../shared/ui/form-modal.component";
import {ModalComponent} from "../shared/ui/modal.component";
import {ToolOutputService} from "./data-access/tool-output.service";
import {ToolOutputListComponent} from "./ui-tools/tool-output-list.component";

@Component({
  selector: 'app-tool-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    ToolInputListComponent,
    FormModalComponent,
    ModalComponent,
    ToolOutputListComponent
  ],
  template: `
    @if (tool(); as tool) {
      <header>
        <button class="button-primary" routerLink="/application/{{tool.applicationId}}">< Back</button>

        <h1>Tool: {{ tool.name }}</h1>
      </header>
    }

    <section>
      <app-tool-input-list
        class="half"
        [toolInputs]="toolInputs()"
        (add)="toolInputBeingEdited.set({})"
        (edit)="toolInputBeingEdited.set($event)"
        (delete)="toolInputService.remove$.next($event)"
      />

      <app-tool-output-list
        class="half"
        [toolOutputs]="toolOutputs()"
        (add)="toolOutputBeingEdited.set({})"
        (edit)="toolOutputBeingEdited.set($event)"
        (delete)="toolOutputService.remove$.next($event)"
      />
    </section>

    <!-- ToolInputForm Modal -->
    <app-modal [isOpen]="!!toolInputBeingEdited()">
      <ng-template>
        <app-form-modal
          [formGroup]="toolInputForm"
          [title]="
            toolInputBeingEdited()?.name
                ? toolInputBeingEdited()!.name!
                : 'Add Input'
          "
          (close)="toolInputBeingEdited.set(null)"
          (save)="
            toolInputBeingEdited()?.id
              ? toolInputService.edit$.next({
                id: toolInputBeingEdited()!.id!,
                data: toolInputForm.getRawValue()
              })
              : toolInputService.add$.next({
                item: toolInputForm.getRawValue(),
                toolId: tool()?.id!
              })
          "
        />
      </ng-template>
    </app-modal>

    <!-- ToolOutputForm Modal -->
    <app-modal [isOpen]="!!toolOutputBeingEdited()">
      <ng-template>
        <app-form-modal
          [formGroup]="toolOutputForm"
          [title]="
            toolOutputBeingEdited()?.name
                ? toolOutputBeingEdited()!.name!
                : 'Add Output'
          "
          (close)="toolOutputBeingEdited.set(null)"
          (save)="
            toolOutputBeingEdited()?.id
              ? toolOutputService.edit$.next({
                id: toolOutputBeingEdited()!.id!,
                data: toolOutputForm.getRawValue()
              })
              : toolOutputService.add$.next({
                item: toolOutputForm.getRawValue(),
                toolId: tool()?.id!
              })
          "
        />
      </ng-template>
    </app-modal>
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
  private fb: FormBuilder = inject(FormBuilder);


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

  // Form for creating/editing toolInputs
  public toolInputForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    label: ['', [Validators.required]],
    type: [0, [Validators.required]],
  });


  // --- ToolOutputs
  public toolOutputs = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.toolOutputService
      .toolOutputs()
      .filter((toolOutput) => toolOutput.toolId == id)
  });

  // Track the toolInput that is currently being edited
  public toolOutputBeingEdited = signal<Partial<ToolOutput> | null>(null);

  // Form for creating/editing toolOutputs
  public toolOutputForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    type: [0, [Validators.required]],
  });


  // --- Effects
  constructor() {
    effect((): void => {
      // ToolInputs
      const toolInput: Partial<ToolInput> | null = this.toolInputBeingEdited();
      if (!toolInput) this.toolInputForm.reset(); // Imperative code
      else {
        this.toolInputForm.patchValue({
          name: toolInput.name,
          label: toolInput.label,
          type: toolInput.type
        });
      }

      // ToolOutputs
      const toolOutput: Partial<ToolOutput> | null = this.toolOutputBeingEdited();
      if (!toolOutput) this.toolOutputForm.reset(); // Imperative code
      else {
        this.toolOutputForm.patchValue({
          name: toolOutput.name,
          type: toolOutput.type
        });
      }
    });
  }
}
