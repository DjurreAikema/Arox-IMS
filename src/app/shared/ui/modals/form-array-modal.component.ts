import {Component, inject, input, OnDestroy, OnInit, output} from '@angular/core';
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

      <button mat-mini-fab (click)="addOption()">
        <mat-icon class="add-course-btn">add</mat-icon>
      </button>

      <div formArrayName="options" class="array-container">
        @for (optionForm of options.controls; track optionForm; let index = $index) {

          <div class="options-form-row" [formGroupName]="index">

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

            <mat-icon class="delete-btn" (click)="removeOption(index)">delete_forever</mat-icon>

          </div>

        }
      </div>

      <div class="form-buttons">
        <button class="button-danger" (click)="handleClose()">Close</button>
        <button class="button-success" (click)="onSubmit()">Save</button>
      </div>

    </form>
  `,
  styles: [`
    form {
      max-height: 900px;
    }

    .array-container {
      max-height: 700px;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    .options-form-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .delete-btn {
      cursor: pointer;
    }
  `]
})
export class FormArrayModalComponent implements OnInit, OnDestroy {

  private fb: FormBuilder = inject(FormBuilder);

  // --- Inputs
  inputId = input.required<RemoveToolInput>();
  // formGroup = input.required<FormGroup>();

  // --- Outputs
  save = output<{options: any[]}>();
  close = output();

  // --- Properties
  protected form = this.fb.group({
    options: this.fb.array([])
  });

  private closedByButton = false;

  // Lifecycle
  ngOnInit() {
    if (this.options.length === 0) {
      this.addOption();
    }
  }

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
    this.save.emit(this.form.getRawValue());
    this.close.emit();
  }

}
