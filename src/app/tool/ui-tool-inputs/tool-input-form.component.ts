import {Component, effect, inject, input, output} from '@angular/core';
import {FormModalComponent} from "../../shared/ui/modals/form-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";
import {ToolInput, ToolInputTypeEnum} from "../../shared/interfaces";
import {CustomFormGroup} from "../../shared/utils/custom-form-group";
import {FormControl, Validators} from "@angular/forms";
import {SelectOptionsService} from "../../shared/data-access/select-options.service";
import {uniqueNameValidator} from "../../shared/validators/unique-name-validator";

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
  styles: []
})
export class ToolInputFormComponent {

  // --- Dependencies
  private selectOptionsService: SelectOptionsService = inject(SelectOptionsService);

  // --- Inputs
  inputBeingEdited = input<Partial<ToolInput> | null>(null);
  existingNames = input<string[] | undefined>(undefined);

  // --- Outputs
  close = output();
  save = output<{ name: string, label: string, placeholder: string, fieldTypeId: number }>();

  // Form for creating/editing toolInputs
  public toolInputForm = new CustomFormGroup({
    name: new FormControl('', Validators.required),
    label: new FormControl('', Validators.required),
    placeholder: new FormControl(''),
    fieldTypeId: new FormControl(ToolInputTypeEnum.Text, Validators.required),
  }, {
    // Extra control info
    name: {
      label: 'Name'
    },
    label: {
      label: 'Input label'
    },
    placeholder: {
      label: 'Input placeholder'
    },
    fieldTypeId: {
      label: 'Input type',
      type: 'select',
      selectOptions: this.selectOptionsService.getToolInputTypeOptions()
    },
  });

  constructor() {
    // Monitor changes to inputBeingEdited to patch form values when editing
    effect((): void => {
      const toolInput: Partial<ToolInput> | null = this.inputBeingEdited();
      if (!toolInput) {
        this.toolInputForm.reset(); // Reset form on new input
        this.toolInputForm.patchValue({
          name: 'Name',
          label: 'Label',
          placeholder: 'Placeholder',
          fieldTypeId: ToolInputTypeEnum.Text // TODO: Remove default testing values
        });
      } else {
        this.toolInputForm.patchValue({
          ...toolInput
        });
      }
    });

    // Watch for changes to existingNames and update the validator dynamically
    effect((): void => {
      if (this.existingNames) {
        // Update the name validator with the latest existingNames
        this.toolInputForm.controls['name'].setValidators([
          Validators.required,
          Validators.minLength(3),
          uniqueNameValidator(this.existingNames())
        ]);
        this.toolInputForm.controls['name'].updateValueAndValidity(); // Trigger validation update
      }
    });
  }
}
