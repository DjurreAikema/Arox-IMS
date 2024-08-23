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
    <div class="list">
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
      }

      <mat-card class="add-card" (click)="add.emit()">

        <mat-card-content class="add-card-content">
          <i class="fa-solid fa-plus"></i>
        </mat-card-content>

      </mat-card>
    </div>
  `,
  styleUrls: ['../../shared/styles/default-list.scss'],
  styles: [``]
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
