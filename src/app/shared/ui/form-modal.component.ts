import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, KeyValuePipe} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, MatFormFieldModule, MatInputModule, JsonPipe, MatIconModule, MatTooltipModule],
  template: `
    <header>
      <h2>{{ title }}</h2>
    </header>

    <section>
      <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" #form="ngForm">
        @for (control of formGroup.controls | keyvalue; track control.key) {

          <!-- TODO: Add support for more control types -->
          <mat-form-field appearance="fill">

            <mat-label>{{ control.key }}</mat-label>

            <input matNativeControl [formControlName]="control.key"
                   type="text" placeholder="placeholder">

            @if ((formGroup.get(control.key)?.dirty || form.submitted) && !formGroup.get(control.key)?.valid) {
              <mat-icon matSuffix matTooltip="{{ getErrorMessages(control.key) }}">error</mat-icon>
            }

          </mat-form-field>

        }

        <div class="form-buttons">
          <button (click)="handleClose()">Close</button>
          <button type="submit">Save</button>
        </div>

      </form>
    </section>
  `,
  styles: [
    `
      mat-form-field {
        display: flex;
        flex-direction: column;
      }

      .form-buttons {
        display: flex;
        flex-flow: row nowrap;
        gap: 10px;
      }

      section button {
        margin-top: 1rem;
        width: 100%;
      }
    `,
  ]
})
// Responsibility: Dumb component that renders a form inside a modal based on a supplied formGroup
export class FormModalComponent implements OnDestroy {

  // Input TODO signal inputs
  @Input({required: true}) formGroup!: FormGroup;
  @Input({required: true}) title!: string;

  // Output TODO signal outputs
  @Output() save: EventEmitter<void> = new EventEmitter<void>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  // Properties
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
    if (!this.formGroup.valid) return;

    this.closedByButton = true;
    this.save.emit();
    this.close.emit();
  }

  protected getErrorMessages(controlName: string): string {
    const control = this.formGroup.get(controlName);
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
}
