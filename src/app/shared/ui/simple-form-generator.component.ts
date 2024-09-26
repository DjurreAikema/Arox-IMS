import {Component, input} from '@angular/core';
import {KeyValuePipe} from "@angular/common";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatTooltip} from "@angular/material/tooltip";
import {FormGroupDirective, ReactiveFormsModule} from "@angular/forms";
import {CustomFormGroup} from "../utils/custom-form-group";
import {getErrorMessages} from "../utils/get-error-messages";

@Component({
  selector: 'app-simple-form-generator',
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
    ReactiveFormsModule
  ],
  template: `
    @for (control of formGroup().controls | keyvalue: originalOrder; track control.key) {

      <mat-form-field appearance="outline" [formGroup]="formGroup()">

        <!-- Input label -->
        <mat-label>{{ (formGroup().getLabel(control.key) || '') }}</mat-label>

        <!-- Input type switch case -->
        @switch (formGroup().getType(control.key)) {

          <!-- Select input -->
          @case ('select') {
            @if (formGroup().getOptions(control.key)) {
              <mat-select [formControlName]="control.key">

                <!-- Select options -->
                @for (option of formGroup().getOptions(control.key); track $index) {
                  <mat-option [value]="option.value">
                    {{ option.label }}
                  </mat-option>
                }

              </mat-select>
            } @else {
              <p>No list found for this select control</p>
            }
          }

          <!-- Text input (default) -->
          @case ('number') {
            <input matNativeControl
                   [formControlName]="control.key"
                   type="number"
                   [placeholder]="this.formGroup().getPlaceholder(control.key)">
          }

          <!-- Text input (default) -->
          @default {
            <input matNativeControl
                   [formControlName]="control.key"
                   type="text"
                   [placeholder]="this.formGroup().getPlaceholder(control.key)">
          }
        }

        <!-- Form errors -->
        @if ((formGroup().isTouched(control.key) || form().submitted) && !formGroup().isValid(control.key)) {
          <mat-icon matSuffix matTooltip="{{ getErrorMessages(control) }}">error</mat-icon>
        }

      </mat-form-field>

    }
  `,
  styles: [`
    mat-form-field {
      display: flex;
      flex-direction: column;
    }
  `]
})
export class SimpleFormGeneratorComponent {

  // --- Dependencies
  protected readonly getErrorMessages = getErrorMessages;

  // --- Inputs
  form = input.required<FormGroupDirective>();
  formGroup = input.required<CustomFormGroup>();

  // --- Functions
  // Maintain the order as defined in the formGroup
  protected originalOrder = (a: any, b: any): number => {
    return 0;
  }
}
