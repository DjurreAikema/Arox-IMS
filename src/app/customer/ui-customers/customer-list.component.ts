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
            <button class="button-danger" (click)="delete.emit(customer.id)">Delete</button>
            <button class="small-button button-success" (click)="edit.emit(customer)">Edit</button>
          </mat-card-footer>

        </mat-card>

      } @empty {
        <p>No customers found, click the add button to create your first customer.</p>
      }
    </div>
  `,
  styles: [
    `
      .customer-list {
        height: 100%;
        width: 100%;

        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 2rem;
      }

      mat-card {
        padding: 1rem;
      }

      mat-card-header {
        padding: 0;
        border-bottom: 1px solid var(--color-dark);
      }

      mat-card-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 350px;
      }

      mat-card-content {
        padding: 1rem 0;
        height: 95px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      mat-card-footer {
        display: flex;
        flex-flow: row nowrap;
        gap: 1rem;

        justify-content: flex-end;
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
