import {Component, input, OnDestroy, output} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="confirm-wrapper">

      <header>
        <h2>{{ title() }}</h2>
      </header>

      <section>
        <p>{{ message() }}</p>

        <div class="confirm-buttons">
          <button class="button" (click)="handleCancel()">Cancel</button>
          <button class="button-danger" (click)="handleConfirm()">Confirm</button>
        </div>
      </section>

    </div>
  `,
  styles: [
    `
      .confirm-wrapper {
        min-width: 300px;
        max-width: 500px;
      }

      .confirm-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
      }
    `,
  ],
})
export class ConfirmModalComponent implements OnDestroy {

  // --- Inputs
  title = input.required<string>();
  message = input.required<string>();

  // --- Outputs
  confirm = output();
  cancel = output();


  // Properties
  private closedByButton = false;

  // Lifecycle
  ngOnDestroy() {
    if (!this.closedByButton) {
      this.cancel.emit();
    }
  }

  // Functions
  protected handleConfirm() {
    this.closedByButton = true;
    this.confirm.emit();
  }

  protected handleCancel() {
    this.closedByButton = true;
    this.cancel.emit();
  }
}
