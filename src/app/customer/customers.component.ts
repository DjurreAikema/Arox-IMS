import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {CustomerService} from "./data-access/customer.service";
import {Customer} from "../shared/interfaces";
import {CustomerListComponent} from "./ui-customers/customer-list.component";
import {ModalComponent} from "../shared/ui/modal.component";
import {FormModalComponent} from "../shared/ui/form-modal.component";
import {ConfirmModalComponent} from "../shared/ui/confirm-modal.component";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CustomerListComponent,
    ModalComponent,
    FormModalComponent,
    ConfirmModalComponent
  ],
  template: `
    <header>
      <h1>Customers and buns</h1>
      <button class="button-success" (click)="customerBeingEdited.set({})">Add Customer +</button>
    </header>

    <section>
      <app-customer-list
        [customers]="customerService.customers()"
        (add)="customerBeingEdited.set({})"
        (edit)="customerBeingEdited.set($event)"
        (delete)="customerToDelete.set($event)"
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

    <app-modal [isOpen]="!!customerToDelete()">
      <ng-template>
        <app-confirm-modal
          title="Delete Customer"
          message="Are you sure you want to delete this customer?"
          (confirm)="deleteCustomer()"
          (cancel)="customerToDelete.set(null)"
        />
      </ng-template>
    </app-modal>
  `,
  styles: [`
    header {
      display: flex;
      flex-flow: row nowrap;

      justify-content: space-between;
      align-items: center;

      padding: 0 1rem;

      border-bottom: 1px solid var(--color-dark);
    }

    h1 {
      margin: 0;
      font-size: 1.8em;
    }

    section {
      padding: 1rem;
      height: calc(100vh - 120px);
      overflow-y: auto;
    }
  `]
})
// Responsibility: Smart component in charge of all customer interactions
export default class CustomersComponent {

  // --- Dependencies
  public fb: FormBuilder = inject(FormBuilder);
  public customerService: CustomerService = inject(CustomerService);


  // --- Properties
  // Track the customer that is currently being edited
  public customerBeingEdited = signal<Partial<Customer> | null>(null);

  // Track the customer that is currently being deleted
  public customerToDelete = signal<number | null>(null);

  // Form for creating/editing customers
  public customerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
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

  // --- Functions
  protected deleteCustomer() {
    if (this.customerToDelete()) {
      this.customerService.remove$.next(this.customerToDelete()!);
      this.customerToDelete.set(null);
    }
  }
}
