import {Component, input, signal} from '@angular/core';
import {Application, Customer, RemoveApplication} from "../../shared/interfaces";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardTitle} from "@angular/material/card";
import {ApplicationExpansionPanelItemComponent} from "../../application/ui-applications/application-expansion-panel-item.component";

@Component({
  selector: 'app-customer-expansion-panel-list',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatCardTitle,
    ApplicationExpansionPanelItemComponent
  ],
  template: `
    <mat-accordion>

      @for (customer of customers(); track customer.id) {
        <!-- Panel -->
        <mat-expansion-panel hideToggle>

          <!-- Panel header -->
          <mat-expansion-panel-header>
            <mat-panel-title> {{ customer.name }}</mat-panel-title>
            <mat-panel-description> [buttons here?]</mat-panel-description>
          </mat-expansion-panel-header>

          <!-- Panel body -->
          @for (application of filteredApplications(customer.id); track application.id) {
            <app-application-expansion-panel-item
              [application]="application"
              [selected]="selectedApplication() === application.id"
              (select)="selectedApplication.set($event)"
            />
          } @empty {
            No applications found
          }

        </mat-expansion-panel>
      }

    </mat-accordion>
  `,
  styles: ``
})
// responsibility: Dumb component that displays a list of customers as an expansion panel (material ui)
export class CustomerExpansionPanelListComponent {

  // --- Inputs
  customers = input.required<Customer[]>();
  applications = input.required<Application[]>();

  // --- Properties
  protected selectedApplication = signal<RemoveApplication | null>(null);

  protected filteredApplications(customerId: number) {
    return this.applications().filter(app => app.customerId === customerId);
  }

}
