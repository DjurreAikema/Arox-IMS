import {Component, inject, input, OnInit} from '@angular/core';
import {ToolInput, ToolInputTypeEnum} from "../interfaces";
import {CustomFormGroup} from "../utils/custom-form-group";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {EnumToTextPipe} from "../pipes/enum-to-text.pipe";
import {KeyValuePipe} from "@angular/common";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatTooltip} from "@angular/material/tooltip";
import {SimpleFormGeneratorComponent} from "./simple-form-generator.component";

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
<!--      <app-simple-form-generator-->
<!--        [formGroup]="inputsForm"-->
<!--      />-->
    } @else {
      <p>No form found.</p>
    }
  `,
  styles: ``
})
export class InputsToFormComponent implements OnInit {

  // --- Dependencies
  private enumToTextPipe: EnumToTextPipe = inject(EnumToTextPipe);

  // --- Inputs
  toolInputs = input.required<ToolInput[]>();

  // --- Properties
  public inputsForm?: CustomFormGroup;

  ngOnInit() {
    const controls: any = {};
    const controlConfigs: any = {};

    this.toolInputs().forEach(input => {
      controls[input.name] = new FormControl('');
      controlConfigs[input.name] = {
        label: input.label,
        placeholder: '',
        type: this.enumToTextPipe.transform(input.type, ToolInputTypeEnum),
        selectOptions: []
      };
    });

    this.inputsForm = new CustomFormGroup(controls, controlConfigs);
  }
}
