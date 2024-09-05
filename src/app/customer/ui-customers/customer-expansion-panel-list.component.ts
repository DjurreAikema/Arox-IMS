import {Component, input} from '@angular/core';
import {Application, Customer} from "../../shared/interfaces";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-customer-expansion-panel-list',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatCardTitle
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
          @for (application of applications(); track application.id) {
            @if (application.customerId == customer.id) {
              {{ application.name }}
            } @else {
              No applications
            }
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

}
