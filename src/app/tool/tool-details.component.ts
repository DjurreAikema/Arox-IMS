import {Component, computed, effect, inject, signal} from '@angular/core';
import {ToolService} from "./data-access/tool.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {JsonPipe} from "@angular/common";
import {ToolInputListComponent} from "./ui-tools/tool-input-list.component";
import {ToolInputService} from "./data-access/tool-input.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ToolInput} from "../shared/interfaces";
import {FormModalComponent} from "../shared/ui/form-modal.component";
import {ModalComponent} from "../shared/ui/modal.component";

@Component({
  selector: 'app-tool-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    ToolInputListComponent,
    FormModalComponent,
    ModalComponent
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

      <app-tool-input-list
        class="half"
        [toolInputs]="toolInputs()"
        (add)="toolInputBeingEdited.set({})"
        (edit)="toolInputBeingEdited.set($event)"
        (delete)="toolInputService.remove$.next($event)"
      />
    </section>

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
      .filter((tool) => tool.toolId == id)
  });

  // Track the toolInput that is currently being edited
  public toolInputBeingEdited = signal<Partial<ToolInput> | null>(null);

  // Form for creating/editing toolInputs
  public toolInputForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    label: ['', [Validators.required]],
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
          label: toolInput.label
        });
      }
    });
  }
}
