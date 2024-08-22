import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {CustomerService} from "./data-access/customer.service";
import {Customer} from "../shared/interfaces";

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [],
  template: `
    <p>
      customer works!
    </p>
  `,
  styles: ``
})
// Responsibility: Smart component in charge of all customer interactions
export default class CustomerComponent {

  // --- Dependencies
  public fb: FormBuilder = inject(FormBuilder);
  public customerService: CustomerService = inject(CustomerService);

  // Track the customer that is currently being edited
  public customerBeingEdited = signal<Partial<Customer> | null>(null);

  // Form for creating/editing customers
  public customerForm = this.fb.nonNullable.group({
    name: [''],
  });

  constructor() {
    // Reset `customerForm` when `customerBeingEdited()` is null
    effect((): void => {
      const customer: Partial<Customer> | null = this.customerBeingEdited();
      if (!customer) this.customerForm.reset(); // Imperative code
      else {
        this.customerForm.patchValue({
          name: customer.name
        });
      }
    });
  }
}
