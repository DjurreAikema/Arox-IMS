import {Component, input, OnDestroy, output} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, KeyValuePipe} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CustomFormGroup} from "../utils/custom-form-group";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, MatFormFieldModule, MatInputModule, JsonPipe, MatIconModule, MatTooltipModule, MatSelect, MatOption],
  template: `
    <div class="form-wrapper">
      <header>
        <h2>{{ title() }}</h2>
      </header>

      <section>
        <form [formGroup]="formGroup()" (ngSubmit)="onSubmit()" #form="ngForm">
          @for (control of formGroup().controls | keyvalue: originalOrder; track control.key) {

            <mat-form-field appearance="fill">

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
              @if ((formGroup().isTouched(control.key) || form.submitted) && !formGroup().isValid(control.key)) {
                <mat-icon matSuffix matTooltip="{{ getErrorMessages(control.key) }}">error</mat-icon>
              }

            </mat-form-field>

          }

          <div class="form-buttons">
            <button class="button-danger" (click)="handleClose()">Close</button>
            <button class="button-success" type="submit">Save</button>
          </div>

        </form>
      </section>
    </div>
  `,
  styles: [
    `
      .form-wrapper {
        min-width: 300px;
        max-width: 1000px;
      }

      mat-form-field {
        display: flex;
        flex-direction: column;
      }

      .form-buttons {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        gap: 1rem;
      }

      section button {
        margin-top: 1rem;
      }

      h2 {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    `,
  ]
})
// Responsibility: Dumb component that renders a form inside a modal based on a supplied CustomFormGroup
export class FormModalComponent implements OnDestroy {

  // --- Inputs
  formGroup = input.required<CustomFormGroup>();
  title = input.required<string>();

  // --- Outputs
  save = output();
  close = output();

  // --- Properties
  private closedByButton = false;

  // Lifecycle
  ngOnDestroy() {
    if (!this.closedByButton) {
      this.close.emit();
    }
  }

  // Functions
  protected handleClose() {
    this.closedByButton = true;
    this.close.emit();
  }

  protected onSubmit() {
    if (!this.formGroup().valid) return;

    this.closedByButton = true;
    this.save.emit();
    this.close.emit();
  }

  // Define the error messages for each Validation
  protected getErrorMessages(controlName: string): string {
    const control = this.formGroup().get(controlName);
    if (!control || !control.errors) return '';

    return Object.keys(control.errors).map(errorKey => {
      switch (errorKey) {
        case 'required':
          return 'This field is required';

        case 'minlength':
          return `Minimum length is ${control.errors![errorKey].requiredLength}`;

        default:
          return `Error: ${errorKey}`;
      }
    }).join(', ');
  }

  // Maintain the order as defined in the formGroup
  protected originalOrder = (a: any, b: any): number => {
    return 0;
  }
}
