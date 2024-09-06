import {Component, input, output, signal} from '@angular/core';
import {MatExpansionModule} from "@angular/material/expansion";
import {Application, Customer, RemoveApplication} from "../../shared/interfaces";
import {ExpansionPanelListHeaderComponent} from "../../shared/ui/expansion-panel-list-header.component";
import {ApplicationExpansionPanelItemComponent} from "./application-expansion-panel-item.component";
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

        <!-- Panel header buttons -->
        <mat-panel-description>
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
          />
        } @empty {
          No applications found
        }
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

  editApplication = output<Application>();
  addApplication = output<RemoveApplication>();
  selectApplication = output<Application | null>();

  // --- Properties
  protected readonly panelOpenState = signal(false);

  protected filteredApplications(customerId: number) {
    return this.applications().filter(app => app.customerId === customerId);
  }

  protected onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.editCustomer.emit(this.customer());
  }

}
