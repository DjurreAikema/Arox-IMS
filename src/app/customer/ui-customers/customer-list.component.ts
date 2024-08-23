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
            <button class="button-danger small-button" (click)="delete.emit(customer.id)">
              <i class="fa-solid fa-trash"></i>
            </button>

            <div>
              <button class="button-success small-button" (click)="edit.emit(customer)">
                <i class="fa-solid fa-pen"></i>
              </button>

              <button class="button-primary" routerLink="/customer/{{customer.id}}">
                Open
              </button>
            </div>

          </mat-card-footer>

        </mat-card>

      } @empty {
        <p>No customers found, click the add button to create your first customer.</p>
      }

      <mat-card class="add-card" (click)="add.emit()">

        <mat-card-content class="add-card-content">
          <i class="fa-solid fa-plus"></i>
        </mat-card-content>

      </mat-card>
    </div>
  `,
  styles: [
    `
      .customer-list {
        height: 100%;
        width: 100%;

        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 2rem;
      }

      mat-card {
        padding: 1rem;
        max-height: 200px;
      }

      mat-card-header {
        padding: 0;
        border-bottom: 1px solid var(--color-dark);
      }

      mat-card-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      mat-card-content {
        padding: 1rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 100%;
      }

      mat-card-footer {
        display: flex;
        flex-flow: row nowrap;
        gap: 1rem;

        justify-content: space-between;
      }

      mat-card-footer div {
        display: flex;
        flex-flow: row nowrap;
        gap: 1rem;
      }

      .add-card {
        background-color: rgba(40, 167, 69, 0.1);
        transition: background-color 0.2s ease;
      }

      .add-card:hover {
        cursor: pointer;
        background-color: rgba(40, 167, 69, 0.3);
      }

      .add-card-content {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ]
})
// responsibility: Dumb component that displays a list of customers
export class CustomerListComponent {

  // --- Inputs
  customers = input.required<Customer[]>();

  // --- Outputs
  add = output();
  edit = output<Customer>();
  delete = output<RemoveCustomer>();

}
