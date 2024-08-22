import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {CustomerService} from "./data-access/customer.service";
import {Customer} from "../shared/interfaces";
import {CustomerListComponent} from "./ui/customer-list.component";
import {ModalComponent} from "../shared/ui/modal.component";
import {FormModalComponent} from "../shared/ui/form-modal.component";

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CustomerListComponent,
    ModalComponent,
    FormModalComponent
  ],
  template: `
    <header>
      <h1>Customers</h1>
      <button (click)="customerBeingEdited.set({})">Add Customer</button>
    </header>

    <section>
      <h2>Your customers</h2>

      <app-customer-list
        [customers]="customerService.customers()"
        (edit)="customerBeingEdited.set($event)"
        (delete)="customerService.remove$.next($event)"
      />
    </section>

    <app-modal [isOpen]="!!customerBeingEdited()">
      <ng-template>
        <app-form-modal
          [formGroup]="customerForm"
          [title]="
            customerBeingEdited()?.name
                ? customerBeingEdited()!.name!
                : 'Add customer'
          "
          (close)="customerBeingEdited.set(null)"
          (save)="
            customerBeingEdited()?.id
                ? customerService.edit$.next({
                    id: customerBeingEdited()!.id!,
                    data: customerForm.getRawValue()
                })
                : customerService.add$.next(customerForm.getRawValue())
            "
        />
      </ng-template>
    </app-modal>
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
