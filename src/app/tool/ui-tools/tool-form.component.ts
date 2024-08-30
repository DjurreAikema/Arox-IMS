import {Component, effect, input, output} from '@angular/core';
import {FormModalComponent} from "../../shared/ui/modals/form-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";
import {CustomFormGroup} from "../../shared/utils/custom-form-group";
import {FormControl, Validators} from "@angular/forms";
import {Tool} from "../../shared/interfaces";

@Component({
  selector: 'app-tool-form',
  standalone: true,
  imports: [
    FormModalComponent,
    ModalComponent
  ],
  template: `
    <app-modal [isOpen]="!!toolBeingEdited()">
      <ng-template>

        <app-form-modal
          [formGroup]="toolForm"
          [title]="
            toolBeingEdited()?.name
                ? toolBeingEdited()!.name!
                : 'Add tool'
          "
          (close)="close.emit()"
          (save)="save.emit(toolForm.getRawValue())"
        />

      </ng-template>
    </app-modal>
  `,
  styles: ``
})
export class ToolFormComponent {

  // --- Inputs
  toolBeingEdited = input<Partial<Tool> | null>(null);

  // --- Outputs
  close = output();
  // POI: Add to ToolForm
  save = output<{ name: string, apiUrl: string }>();

  // Form for creating/editing tools
  // POI: Add to ToolForm
  public toolForm = new CustomFormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    apiUrl: new FormControl('', [Validators.required, Validators.minLength(3)]),
  }, {
    // Extra control info
    name: {
      label: 'Name',
      placeholder: 'Tool name'
    },
    apiUrl: {
      label: 'API url',
      placeholder: 'https://localhost:8080'
    },
  });

  constructor() {
    // Reset `toolForm` when `toolBeingEdited()` is null
    effect((): void => {
      const tool: Partial<Tool> | null = this.toolBeingEdited();
      if (!tool) this.toolForm.reset(); // Imperative code
      else {
        this.toolForm.patchValue({
          ...tool
        });
      }
    });
  }
}
