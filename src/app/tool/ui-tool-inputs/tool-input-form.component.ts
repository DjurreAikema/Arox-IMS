import {Component, effect, input, output} from '@angular/core';
import {FormModalComponent} from "../../shared/ui/form-modal.component";
import {ModalComponent} from "../../shared/ui/modal.component";
import {ToolInput} from "../../shared/interfaces";
import {CustomFormGroup} from "../../shared/utils/custom-form-group";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-tool-input-form',
  standalone: true,
  imports: [
    FormModalComponent,
    ModalComponent
  ],
  template: `
    <app-modal [isOpen]="!!inputBeingEdited()">
      <ng-template>

        <app-form-modal
          [formGroup]="toolInputForm"
          [title]="
            inputBeingEdited()?.name
                ? inputBeingEdited()!.name!
                : 'Add tool input'
          "
          (close)="close.emit()"
          (save)="save.emit(toolInputForm.getRawValue())"
        />

      </ng-template>
    </app-modal>
  `,
  styles: ``
})
export class ToolInputFormComponent {

  // --- Inputs
  inputBeingEdited = input<Partial<ToolInput> | null>(null);

  // --- Outputs
  close = output();
  save = output<{ name: string, label: string, type: number }>();

  // Form for creating/editing toolInputs
  public toolInputForm = new CustomFormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    label: new FormControl('', [Validators.required]),
    type: new FormControl(0, [Validators.required]),
  }, {
    // Labels
    name: 'Name',
    label: 'Input Label',
    type: 'Input Type',
  }, {
    // Placeholders
    name: '',
    label: '',
    type: '',
  });

  constructor() {
    effect((): void => {
      const toolInput: Partial<ToolInput> | null = this.inputBeingEdited();
      if (!toolInput) this.toolInputForm.reset(); // Imperative code
      else {
        this.toolInputForm.patchValue({
          ...toolInput
        });
      }
    });
  }
}
