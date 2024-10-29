import {Component, effect, input, OnInit} from '@angular/core';
import {ToolInputTypeEnum, ToolOutput} from "../../shared/interfaces";
import {CustomFormGroup} from "../../shared/utils/custom-form-group";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {SimpleFormGeneratorComponent} from "../../shared/ui/simple-form-generator.component";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-outputs-to-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SimpleFormGeneratorComponent,
    JsonPipe
  ],
  template: `
    @if (outputsForm) {

      <div class="wrapper">
        <h6>Tool Outputs</h6>

        <form [formGroup]="outputsForm" #form="ngForm">

          <app-simple-form-generator
            [form]="form"
            [formGroup]="outputsForm"
          />

        </form>
      </div>

      {{ executeResponse() | json }}

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
export class OutputsToFormComponent implements OnInit {

  // --- Inputs
  toolOutputs = input.required<ToolOutput[]>();
  executeResponse = input<any>();

  // --- Properties
  public outputsForm?: CustomFormGroup;

  ngOnInit() {
    const controls: any = {};
    const controlConfigs: any = {};

    this.toolOutputs().forEach(output => {
      controls[output.name] = new FormControl('');
      controlConfigs[output.name] = {
        label: output.name, // TODO
        type: this.getControlType(output.fieldTypeId),
      }
    });

    this.outputsForm = new CustomFormGroup(controls, controlConfigs);
    this.outputsForm.disable();
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

  constructor() {
    effect((): void => {
      const response: any = this.executeResponse();
      if (response && this.outputsForm) {
        for (const [key, value] of Object.entries(response)) {
          if (this.outputsForm.controls[key]) {
            this.outputsForm.controls[key].setValue(value);
          }
        }
      }
    });
  }
}
