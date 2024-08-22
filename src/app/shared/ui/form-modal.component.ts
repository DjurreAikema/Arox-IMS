import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {KeyValuePipe} from "@angular/common";

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe],
  template: `
    <header>
      <h2>{{ title }}</h2>
      <button (click)="close.emit()">Close</button>
    </header>

    <section>
      <form [formGroup]="formGroup" (ngSubmit)="save.emit(); close.emit()">
        @for (control of formGroup.controls | keyvalue; track control.key) {
          <div>
            <label [for]="control.key">{{ control.key }}</label>
            <!-- TODO: Add more than just text controls -->
            <input
              [id]="control.key"
              type="text"
              [formControlName]="control.key"
            />
          </div>
        }
        <button type="submit">Save</button>
      </form>
    </section>
  `,
  styles: [
    `
      form {
        padding: 1rem;
      }

      div {
        display: flex;
        flex-direction: column;

        label {
          margin-bottom: 1rem;
          font-weight: bold;
        }

        input {
          font-size: 1.5rem;
          padding: 10px;
        }
      }

      section button {
        margin-top: 1rem;
        width: 100%;
      }
    `,
  ]
})
// Responsibility: Dumb component that TODO
export class FormModalComponent {
  @Input({required: true}) formGroup!: FormGroup;
  @Input({required: true}) title!: string;

  @Output() save: EventEmitter<void> = new EventEmitter<void>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
}
