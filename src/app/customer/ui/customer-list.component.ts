import {Component, input, output} from '@angular/core';
import {Customer, RemoveCustomer} from "../../shared/interfaces";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  template: `
    <ul>
      @for (customer of customers(); track customer.id) {
        <li>

          <a routerLink="/customer/{{customer.id}}">
            {{ customer.name }}
          </a>

          <div>
            <button (click)="edit.emit(customer)">Edit</button>
            <button (click)="delete.emit(customer.id)">Delete</button>
          </div>

        </li>
      } @empty {
        <p>No customers found, click the add button to create your first customer.</p>
      }
    </ul>
  `,
  styles: [
    `
      ul {
        padding: 0;
        margin: 0;
      }

      li {
        font-size: 1.5em;
        display: flex;
        justify-content: space-between;
        background: var(--color-light);
        list-style-type: none;
        margin-bottom: 1rem;
        padding: 1rem;

        button {
          margin-left: 1rem;
        }
      }
    `,
  ]
})
// responsibility: Dumb component that displays a list of customers
export class CustomerListComponent {

  // --- Inputs
  customers = input.required<Customer[]>();

  // --- Outputs
  edit = output<Customer>();
  delete = output<RemoveCustomer>();

}
