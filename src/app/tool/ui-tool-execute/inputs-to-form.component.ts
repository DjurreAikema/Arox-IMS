import {Component, input, OnInit, output} from '@angular/core';
import {ToolInput, ToolInputTypeEnum} from "../../shared/interfaces";
import {CustomFormGroup} from "../../shared/utils/custom-form-group";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {KeyValuePipe} from "@angular/common";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatTooltip} from "@angular/material/tooltip";
import {SimpleFormGeneratorComponent} from "../../shared/ui/simple-form-generator.component";

@Component({
  selector: 'app-inputs-to-form',
  standalone: true,
  imports: [
    KeyValuePipe,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    MatTooltip,
    ReactiveFormsModule,
    SimpleFormGeneratorComponent
  ],
  template: `
    @if (inputsForm) {

      <div class="wrapper">
        <h6>Tool Inputs</h6>

        <form [formGroup]="inputsForm" #form="ngForm">

          <app-simple-form-generator
            [form]="form"
            [formGroup]="inputsForm"
          />

          <div class="form-buttons">
            <button class="button-warning">Clear</button>
            <button class="button-success" (click)="send.emit(inputsForm.getRawValue())">Send</button>
          </div>

        </form>
      </div>

    } @else {
      <p>No form found.</p>
    }
  `,
  styles: [`
    .wrapper {
      background-color: white;
      padding: 1rem;
    }

    .form-buttons {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
    }
  `]
})
export class InputsToFormComponent implements OnInit {

  // --- Inputs
  toolInputs = input.required<ToolInput[]>();

  // --- Outputs
  send = output();

  // --- Properties
  public inputsForm?: CustomFormGroup;

  ngOnInit() {
    const controls: any = {};
    const controlConfigs: any = {};

    this.toolInputs().forEach(input => {
      controls[input.name] = new FormControl('');
      controlConfigs[input.name] = {
        label: input.label,
        placeholder: input.placeholder,
        type: this.getControlType(input.fieldTypeId),
        selectOptions: [{value: 'a', label: 'aa'}, {value: 'b', label: 'bb'}] // TODO
      };
    });

    this.inputsForm = new CustomFormGroup(controls, controlConfigs);
  }

  // TODO Improve this
  // POI: Add to ToolInputTypeEnum
  private getControlType(type: ToolInputTypeEnum): string {
    switch (type) {

      case ToolInputTypeEnum.Number:
        return 'number';

      case ToolInputTypeEnum.Select:
        return 'select';

      default:
        return 'text';

    }
  }
}
