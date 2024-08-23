import {Component, input, output} from '@angular/core';
import {Customer, RemoveCustomer} from "../../shared/interfaces";
import {RouterLink} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="customer-list">
      @for (customer of customers(); track customer.id) {

        <mat-card>

          <mat-card-header>
            <mat-card-title>{{ customer.name }}</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <p>Description</p>
          </mat-card-content>

          <mat-card-footer>
            <button class="button-success" (click)="edit.emit(customer)">Edit</button>
            <button class="button-danger" (click)="delete.emit(customer.id)">Delete</button>
          </mat-card-footer>

        </mat-card>

      } @empty {
        <p>No customers found, click the add button to create your first customer.</p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-flow: column nowrap;
        height: 100%;
      }

      .customer-list {
        display: flex;
        flex-flow: row wrap;
        gap: 2rem;
        overflow-y: auto;
        height: 100%;
      }

      mat-card {
        padding: 1rem;
      }

      mat-card-header {
        padding: 0;
        border-bottom: 1px solid var(--color-dark);
      }

      mat-card-content {
        padding: 1rem 0;
      }

      mat-card-footer {
        display: flex;
        flex-flow: row nowrap;
        gap: 1rem;
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
