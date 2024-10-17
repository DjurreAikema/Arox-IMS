import {Component, inject, signal} from '@angular/core';
import {CustomerService} from "./data-access/customer.service";
import {Customer} from "../shared/interfaces";
import {CustomerListComponent} from "./ui/customer-list.component";
import {CustomerFormComponent} from "./ui/customer-form.component";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CustomerListComponent,
    CustomerFormComponent
  ],
  template: `
    <!-- Header -->
    <header>
      <h1>Customers</h1>
      <button class="button-success" (click)="customerBeingEdited.set({})">Add Customer +</button>
    </header>

    <!-- List -->
    <section>
      <app-customer-list
        [customers]="customerService.customers()"
        (add)="customerBeingEdited.set({})"
        (edit)="customerBeingEdited.set($event)"
        (delete)="customerService.remove$.next($event)"
      />
    </section>

    <!-- Form modal -->
    <app-customer-form
      [customerBeingEdited]="customerBeingEdited()"
      (close)="customerBeingEdited.set(null)"
      (save)="
            customerBeingEdited()?.id
                ? customerService.edit$.next({
                    id: customerBeingEdited()!.id!,
                    data: $event
                })
                : customerService.add$.next($event)
        "
    />
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
  public customerService: CustomerService = inject(CustomerService);

  // Track the customer that is currently being edited
  public customerBeingEdited = signal<Partial<Customer> | null>(null);

}
