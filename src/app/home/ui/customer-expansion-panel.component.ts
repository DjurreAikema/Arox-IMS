import {Component, input, output, signal} from '@angular/core';
import {MatExpansionModule} from "@angular/material/expansion";
import {Application, Customer, RemoveApplication, RemoveCustomer} from "../../shared/interfaces";
import {ExpansionPanelListHeaderComponent} from "../../shared/ui/expansion-panel-list-header.component";
import {ApplicationExpansionPanelItemComponent} from "./application-expansion-panel-item.component";
import {MatTooltip} from "@angular/material/tooltip";
import {ConfirmModalComponent} from "../../shared/ui/modals/confirm-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";

@Component({
  selector: 'app-customer-expansion-panel',
  standalone: true,
  imports: [
    MatExpansionModule,
    ExpansionPanelListHeaderComponent,
    ApplicationExpansionPanelItemComponent,
    MatTooltip,
    ConfirmModalComponent,
    ModalComponent
  ],
  template: `
    <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">

      <!-- Panel header -->
      <mat-expansion-panel-header>

        <mat-panel-title>{{ customer().name }}</mat-panel-title>

        <!-- Panel header buttons -->
        <mat-panel-description>
          <button class="button-danger small-button mr-5" (click)="deleteCustomer.emit(customer().id)"
                  matTooltip="Delete customer" matTooltipPosition="right">
            <i class="fa-solid fa-trash"></i>
          </button>

          <button class="button-info small-button" (click)="onButtonClick($event)"
                  matTooltip="Edit customer" matTooltipPosition="right">
            <i class="fa-solid fa-pen"></i>
          </button>
        </mat-panel-description>

      </mat-expansion-panel-header>


      <!-- Panel body -->
      @if (filteredApplications(customer().id); as filteredApplications) {
        <app-expansion-panel-list-header [text]="'Applications (' + filteredApplications.length + ')'">
          <!-- Quick add application button -->
          <button class="button-success small-button" (click)="addApplication.emit(customer().id)"
                  matTooltip="Quick add application" matTooltipPosition="right">
            <i class="fa-solid fa-plus"></i>
          </button>
        </app-expansion-panel-list-header>

        <!-- Application list -->
        @for (application of filteredApplications; track application.id) {
          <app-application-expansion-panel-item
            [application]="application"
            [selected]="selectedApplication()?.id === application.id"

            (select)="selectApplication.emit($event)"
            (edit)="editApplication.emit($event)"
            (delete)="applicationToDelete.set($event)"
          />
        } @empty {
          No applications found.
        }
      }

    </mat-expansion-panel>

    <!-- Application delete modal -->
    <app-modal [isOpen]="!!applicationToDelete()">
      <ng-template>

        <app-confirm-modal
          title="Delete Application"
          message="Are you sure you want to delete this application?"
          (confirm)="handleDeleteApplication()"
          (cancel)="applicationToDelete.set(null)"
        />

      </ng-template>
    </app-modal>
  `,
  styles: [`
    .mat-expansion-panel:last-of-type {
      border-bottom-right-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }

    .mat-expansion-panel:first-of-type {
      border-top-right-radius: 0 !important;
      border-top-left-radius: 0 !important;
    }

    mat-panel-description {
      justify-content: flex-end;
    }
  `]
})
// Responsibility: TODO
export class CustomerExpansionPanelComponent {

  // --- Inputs
  customer = input.required<Customer>();
  applications = input.required<Application[]>();
  selectedApplication = input.required<Application | null>();

  // --- Outputs
  editCustomer = output<Customer>();
  deleteCustomer = output<RemoveCustomer>();

  editApplication = output<Application>();
  addApplication = output<RemoveApplication>();
  selectApplication = output<Application | null>();
  deleteApplication = output<RemoveApplication>();

  // --- Properties
  protected readonly panelOpenState = signal(false);

  protected filteredApplications(customerId: number) {
    return this.applications().filter(app => app.customerId === customerId);
  }

  protected onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.editCustomer.emit(this.customer());
  }

  // Deleting applications
  protected applicationToDelete = signal<RemoveApplication | null>(null);

  protected handleDeleteApplication() {
    if (this.applicationToDelete()) {
      this.deleteApplication.emit(this.applicationToDelete()!);
      this.applicationToDelete.set(null);
    }
  }
}
