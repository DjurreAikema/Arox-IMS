import {Component, input, output, signal} from '@angular/core';
import {Application, Customer, RemoveApplication} from "../../shared/interfaces";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardTitle} from "@angular/material/card";
import {ApplicationExpansionPanelItemComponent} from "../../application/ui-applications/application-expansion-panel-item.component";
import {ExpansionPanelListHeaderComponent} from "../../shared/ui/expansion-panel-list-header.component";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-customer-expansion-panel-list',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatCardTitle,
    ApplicationExpansionPanelItemComponent,
    ExpansionPanelListHeaderComponent,
    MatTooltip
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
          <app-expansion-panel-list-header
            text="Applications">

            <button class="button-success small-button" (click)="add.emit(customer.id)"
                    matTooltip="Quick add application" matTooltipPosition="right">
              <i class="fa-solid fa-plus"></i>
            </button>

          </app-expansion-panel-list-header>

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
  styles: [`
    mat-expansion-panel-header {
      user-select: none;
    }
  `]
})
// responsibility: Dumb component that displays a list of customers as an expansion panel (material ui)
export class CustomerExpansionPanelListComponent {

  // --- Inputs
  customers = input.required<Customer[]>();
  applications = input.required<Application[]>();

  // --- Outputs
  add = output<number>();

  // --- Properties
  protected selectedApplication = signal<RemoveApplication | null>(null);

  protected filteredApplications(customerId: number) {
    return this.applications().filter(app => app.customerId === customerId);
  }

}
