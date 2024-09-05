import {Component, input, output, signal} from '@angular/core';
import {MatExpansionModule} from "@angular/material/expansion";
import {Application, Customer, RemoveApplication} from "../../shared/interfaces";
import {ExpansionPanelListHeaderComponent} from "../../shared/ui/expansion-panel-list-header.component";
import {ApplicationExpansionPanelItemComponent} from "../../application/ui-applications/application-expansion-panel-item.component";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-customer-expansion-panel',
  standalone: true,
  imports: [
    MatExpansionModule,
    ExpansionPanelListHeaderComponent,
    ApplicationExpansionPanelItemComponent,
    MatTooltip
  ],
  template: `
    <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">

      <!-- Panel header -->
      <mat-expansion-panel-header>
        <mat-panel-title>{{ customer().name }}</mat-panel-title>
        <mat-panel-description>[buttons here?]</mat-panel-description>
      </mat-expansion-panel-header>

      <!-- Panel body -->
      <app-expansion-panel-list-header text="Applications">
        <!-- Quick add application button -->
        <button class="button-success small-button" (click)="addApplication.emit(customer().id)"
                matTooltip="Quick add application" matTooltipPosition="right">
          <i class="fa-solid fa-plus"></i>
        </button>
      </app-expansion-panel-list-header>

      <!-- Application list -->
      @for (application of filteredApplications(customer().id); track application.id) {
        <app-application-expansion-panel-item
          [application]="application"
          [selected]="selectedApplication() === application.id"
          (select)="selectedApplication.set($event)"
        />
      } @empty {
        No applications found
      }

    </mat-expansion-panel>
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
  `]
})
export class CustomerExpansionPanelComponent {

  // --- Inputs
  customer = input.required<Customer>();
  applications = input.required<Application[]>();

  // --- Outputs
  addApplication = output<number>();

  // --- Properties
  protected readonly panelOpenState = signal(false);
  protected selectedApplication = signal<RemoveApplication | null>(null);

  protected filteredApplications(customerId: number) {
    return this.applications().filter(app => app.customerId === customerId);
  }

}
