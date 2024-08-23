import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ToolService} from "./data-access/tool.service";
import {Tool} from "../shared/interfaces";
import {ToolListComponent} from "./ui-tools/tool-list.component";
import {ModalComponent} from "../shared/ui/modal.component";
import {FormModalComponent} from "../shared/ui/form-modal.component";

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [
    ToolListComponent,
    ModalComponent,
    FormModalComponent
  ],
  template: `
    <header>
      <h1>Tools</h1>
      <button class="button-primary" (click)="toolBeingEdited.set({})">Add Tool</button>
    </header>

    <section>
      <app-tool-list
        [tools]="toolService.tools()"
        (edit)="toolBeingEdited.set($event)"
        (delete)="toolService.remove$.next($event)"
      />
    </section>

<!--    <app-modal [isOpen]="!!toolBeingEdited()">-->
<!--      <ng-template>-->
<!--        <app-form-modal-->
<!--          [formGroup]="toolForm"-->
<!--          [title]="-->
<!--            toolBeingEdited()?.name-->
<!--                ? toolBeingEdited()!.name!-->
<!--                : 'Add tool'-->
<!--          "-->
<!--          (close)="toolBeingEdited.set(null)"-->
<!--          (save)="-->
<!--            toolBeingEdited()?.id-->
<!--                ? toolService.edit$.next({-->
<!--                    id: toolBeingEdited()!.id!,-->
<!--                    data: toolForm.getRawValue()-->
<!--                })-->
<!--                : toolService.add$.next(toolForm.getRawValue())-->
<!--            "-->
<!--        />-->
<!--      </ng-template>-->
<!--    </app-modal>-->
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
      padding: 1rem;
      height: calc(100vh - 120px);
      overflow-y: auto;
    }
  `]
})
// Responsibility: Smart component in charge of all tool interactions
export default class ToolsComponent {

  // --- Dependencies
  public fb: FormBuilder = inject(FormBuilder);
  public toolService: ToolService = inject(ToolService);

  // Track the tool that is currently being edited
  public toolBeingEdited = signal<Partial<Tool> | null>(null);

  // Form for creating/editing tools
  public toolForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor() {
    // Reset `toolForm` when `toolBeingEdited()` is null
    effect((): void => {
      const tool: Partial<Tool> | null = this.toolBeingEdited();
      if (!tool) this.toolForm.reset(); // Imperative code
      else {
        this.toolForm.patchValue({
          name: tool.name
        });
      }
    });
  }
}
