import {Component, inject, input, OnDestroy, output} from '@angular/core';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {RemoveToolInput} from "../../interfaces";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";

@Component({
  selector: 'app-form-array-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    MatMiniFabButton
  ],
  template: `
    <form class="options-form" [formGroup]="form">
      <ng-container formArrayName="options">
        @for (optionForm of options.controls; track $index) {

          <div class="options-form-row">

            <mat-form-field appearance="fill">
              <input matNativeControl
                     formControlName="label"
                     placeholder="Option label">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <input matNativeControl
                     formControlName="value"
                     placeholder="Option values">
            </mat-form-field>

            <mat-icon class="delete-btn" (click)="removeOption($index)">delete_forever</mat-icon>

          </div>

        }
      </ng-container>

      <button mat-mini-fab (click)="addOption()">
        <mat-icon class="add-course-btn">add</mat-icon>
      </button>
    </form>
  `,
  styles: ``
})
export class FormArrayModalComponent implements OnDestroy {

  private fb: FormBuilder = inject(FormBuilder);

  // --- Inputs
  inputId = input.required<RemoveToolInput>();
  // formGroup = input.required<FormGroup>();

  // --- Outputs
  save = output();
  close = output();

  // --- Properties
  protected form = this.fb.group({
    options: this.fb.array([
      {
        label: ['', Validators.required],
        value: ['', Validators.required]
      }
    ])
  });

  private closedByButton = false;

  // Lifecycle
  ngOnDestroy() {
    if (!this.closedByButton) {
      this.close.emit();
    }
  }

  // Functions
  get options() {
    return this.form.get("options") as FormArray;
  }

  protected addOption() {
    const optionForm = this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required]
    });

    this.options.push(optionForm);
  }

  protected removeOption(optionIndex: number) {
    this.options.removeAt(optionIndex);
  }

  protected handleClose() {
    this.closedByButton = true;
    this.close.emit();
  }

  protected onSubmit() {
    if (!this.form.valid) return;

    this.closedByButton = true;
    this.save.emit();
    this.close.emit();
  }

}
