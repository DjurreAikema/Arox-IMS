import {Component, input, OnDestroy, output} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {KeyValuePipe} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CustomFormGroup} from "../utils/custom-form-group";
import {MatOption, MatSelect} from "@angular/material/select";
import {SimpleFormGeneratorComponent} from "./simple-form-generator.component";

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule, MatSelect, MatOption, SimpleFormGeneratorComponent],
  template: `
    <div class="form-wrapper">
      <header>
        <h2>{{ title() }}</h2>
      </header>

      <section>
        <form [formGroup]="formGroup()" (ngSubmit)="onSubmit()" #form="ngForm">

          <app-simple-form-generator
            [form]="form"
            [formGroup]="formGroup()"
          />

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
}
