import {Component, effect, inject, input, output} from '@angular/core';
import {ToolOutput, ToolOutputTypeEnum} from "../../shared/interfaces";
import {FormModalComponent} from "../../shared/ui/modals/form-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";
import {CustomFormGroup} from "../../shared/utils/custom-form-group";
import {FormControl, Validators} from "@angular/forms";
import {SelectOptionsService} from "../../shared/data-access/select-options.service";

@Component({
  selector: 'app-tool-output-form',
  standalone: true,
  imports: [
    FormModalComponent,
    ModalComponent
  ],
  template: `
    <app-modal [isOpen]="!!outputBeingEdited()">
      <ng-template>

        <app-form-modal
          [formGroup]="toolOutputForm"
          [title]="
            outputBeingEdited()?.name
                ? outputBeingEdited()!.name!
                : 'Add tool output'
          "
          (close)="close.emit()"
          (save)="save.emit(toolOutputForm.getRawValue())"
        />

      </ng-template>
    </app-modal>
  `,
  styles: ``
})
export class ToolOutputFormComponent {

  // --- Dependencies
  private selectOptionsService: SelectOptionsService = inject(SelectOptionsService);

  // --- Inputs
  outputBeingEdited = input<Partial<ToolOutput> | null>(null);

  // --- Outputs
  close = output();
  save = output<{ name: string, type: number }>();

  // Form for creating/editing toolOutputs
  public toolOutputForm = new CustomFormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    type: new FormControl(ToolOutputTypeEnum.Text, [Validators.required]),
  }, {
    // Extra control info
    name: {
      label: 'Name'
    },
    type: {
      label: 'Output type',
      type: 'select',
      selectOptions: this.selectOptionsService.getToolOutputTypeOptions()
    },
  });

  constructor() {
    effect((): void => {
      const toolOutput: Partial<ToolOutput> | null = this.outputBeingEdited();
      if (!toolOutput) this.toolOutputForm.reset(); // Imperative code
      else {
        this.toolOutputForm.patchValue({
          ...toolOutput
        });
      }
    });
  }
}
