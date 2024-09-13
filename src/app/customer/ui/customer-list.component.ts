import {Component, input, output, signal} from '@angular/core';
import {Customer, RemoveCustomer} from "../../shared/interfaces";
import {RouterLink} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {ConfirmModalComponent} from "../../shared/ui/modals/confirm-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatChipsModule,
    ConfirmModalComponent,
    ModalComponent
  ],
  template: `
    <div class="list">
      @for (customer of customers(); track customer.id) {

        <!-- Customer Card -->
        <mat-card>

          <mat-card-header>
            <mat-card-title>{{ customer.name }}</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <p>Description</p>
          </mat-card-content>

          <mat-card-footer>
            <button class="button-danger small-button" (click)="customerToDelete.set(customer.id)">
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

      <!-- Add card -->
      <mat-card class="add-card" (click)="add.emit()">

        <mat-card-content class="add-card-content">
          <i class="fa-solid fa-plus"></i>
        </mat-card-content>

      </mat-card>
    </div>

    <!-- Delete modal -->
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

  // --- Properties
  protected customerToDelete = signal<RemoveCustomer | null>(null);

  protected deleteCustomer() {
    if (this.customerToDelete()) {
      this.delete.emit(this.customerToDelete()!);
      this.customerToDelete.set(null);
    }
  }
}
