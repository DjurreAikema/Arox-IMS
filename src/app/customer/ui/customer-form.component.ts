import {Component, effect, input, output} from '@angular/core';
import {FormModalComponent} from "../../shared/ui/modals/form-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";
import {Customer} from "../../shared/interfaces";
import {CustomFormGroup} from "../../shared/utils/custom-form-group";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    FormModalComponent,
    ModalComponent
  ],
  template: `
    <app-modal [isOpen]="!!customerBeingEdited()">
      <ng-template>

        <app-form-modal
          [formGroup]="customerForm"
          [title]="
            customerBeingEdited()?.name
                ? customerBeingEdited()!.name!
                : 'Add Customer'
          "
          (close)="close.emit()"
          (save)="save.emit(customerForm.getRawValue())"
        />

      </ng-template>
    </app-modal>
  `,
  styles: ``
})
export class CustomerFormComponent {

  // --- Inputs
  customerBeingEdited = input<Partial<Customer> | null>(null);

  // --- Outputs
  close = output();
  // POI: Add to CustomerForm
  save = output<{ name: string }>();

  // Form for creating/editing customers
  // POI: Add to CustomerForm
  public customerForm = new CustomFormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  }, {
    // Extra control info
    name: {
      label: 'Name',
      placeholder: 'Customer name'
    },
  });

  constructor() {
    // Reset `customerForm` when `customerBeingEdited()` is null
    effect((): void => {
      const customer: Partial<Customer> | null = this.customerBeingEdited();
      if (!customer) this.customerForm.reset(); // Imperative code
      else {
        this.customerForm.patchValue({
          ...customer
        });
      }
    });
  }
}
