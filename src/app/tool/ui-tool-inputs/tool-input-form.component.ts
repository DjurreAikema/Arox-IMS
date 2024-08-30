import {Component, effect, inject, input, output} from '@angular/core';
import {FormModalComponent} from "../../shared/ui/modals/form-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";
import {ToolInput, ToolInputTypeEnum} from "../../shared/interfaces";
import {CustomFormGroup} from "../../shared/utils/custom-form-group";
import {FormControl, Validators} from "@angular/forms";
import {SelectOptionsService} from "../../shared/data-access/select-options.service";

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
// Responsibility: TODO
export class ToolInputFormComponent {

  // --- Dependencies
  private selectOptionsService: SelectOptionsService = inject(SelectOptionsService);

  // --- Inputs
  inputBeingEdited = input<Partial<ToolInput> | null>(null);

  // --- Outputs
  close = output();
  save = output<{ name: string, label: string, type: number }>();

  // Form for creating/editing toolInputs
  public toolInputForm = new CustomFormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    label: new FormControl('', [Validators.required]),
    type: new FormControl(ToolInputTypeEnum.Text, [Validators.required]),
  }, {
    // Extra control info
    name: {
      label: 'Name'
    },
    label: {
      label: 'Input label'
    },
    type: {
      label: 'Input type',
      type: 'select',
      selectOptions: this.selectOptionsService.getToolInputTypeOptions()
    },
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
