import {Component, inject, input, OnDestroy, OnInit, output} from '@angular/core';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputOption, RemoveInputOption, RemoveToolInput} from "../../interfaces";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-form-array-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    MatMiniFabButton,
    MatTooltip
  ],
  template: `
    <header>
      <h2>Input list</h2>

      <button class="button-success small-button" (click)="addOption()"
              matTooltip="Add option" matTooltipPosition="right">
        <i class="fa-solid fa-plus"></i>
      </button>
    </header>

    <form class="options-form" [formGroup]="form">

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

            <button class="button-danger small-button" (click)="removeOption(index)"
                    matTooltip="Delete option" matTooltipPosition="right">
              <i class="fa-solid fa-trash"></i>
            </button>

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
    header {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;

      padding: 1rem 0;

      h2 {
        margin: 0;
      }
    }

    form {
      max-height: 900px;
    }

    .array-container {
      max-height: 700px;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .options-form-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .delete-btn {
      cursor: pointer;
    }

    .form-buttons {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      gap: 1rem;
    }
  `]
})
export class FormArrayModalComponent implements OnInit, OnDestroy {

  private fb: FormBuilder = inject(FormBuilder);

  // --- Inputs
  inputId = input.required<RemoveToolInput>();
  existingOptions = input<InputOption[] | null>();

  // --- Outputs
  save = output<{ options: any[] }>();
  remove = output<RemoveInputOption>()
  close = output();

  // --- Properties
  protected form = this.fb.group({
    options: this.fb.array([])
  });

  private closedByButton = false;

  // Lifecycle
  ngOnInit() {
    if (this.existingOptions() && this.existingOptions()!.length > 0) {
      this.existingOptions()!.forEach(option => this.addOption(option))
    } else {
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

  protected addOption(option: InputOption | null = null) {
    const optionForm = this.fb.group({
      id: [option ? option.id : ''],
      inputId: [option ? option.inputId : ''],
      label: [option ? option.label : '', Validators.required],
      value: [option ? option.value : '', Validators.required]
    });

    this.options.push(optionForm);
  }

  protected removeOption(optionIndex: number) {
    const option = this.options.at(optionIndex)?.value;
    if (option && option.id) this.remove.emit(option.id);

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
