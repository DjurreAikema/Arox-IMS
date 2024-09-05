import {Component, inject, signal} from '@angular/core';
import {CustomerExpansionPanelListComponent} from "../customer/ui-customers/customer-expansion-panel-list.component";
import {CustomerService} from "../customer/data-access/customer.service";
import {ApplicationService} from "../application/data-access/application.service";
import {Application, Customer} from "../shared/interfaces";
import {CustomerFormComponent} from "../customer/ui-customers/customer-form.component";
import {MatTooltip} from "@angular/material/tooltip";
import {ApplicationFormComponent} from "../application/ui-applications/application-form.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CustomerExpansionPanelListComponent,
    CustomerFormComponent,
    MatTooltip,
    ApplicationFormComponent
  ],
  template: `
    <div class="wrapper">

      <div>
        <div class="list-header">
          <h4>Customers and Applications</h4>

          <button class="button-success small-button" (click)="customerBeingEdited.set({})"
                  matTooltip="Quick add customer" matTooltipPosition="right">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>

        <app-customer-expansion-panel-list
          [customers]="customerService.customers()"
          [applications]="applicationService.applications()"
          (addApplication)="applicationBeingEdited.set({customerId: $event})"
        />
      </div>

      <div>
        <h4>Tools</h4>
        right side
      </div>

    </div>

    <!-- Customer form modal -->
    <app-customer-form
      [customerBeingEdited]="customerBeingEdited()"
      (close)="customerBeingEdited.set(null)"
      (save)="
            customerBeingEdited()?.id
                ? customerService.edit$.next({
                    id: customerBeingEdited()!.id!,
                    data: $event
                })
                : customerService.add$.next($event)
        "
    />

    <!-- Application form modal -->
    <app-application-form
      [applicationBeingEdited]="applicationBeingEdited()"
      (close)="applicationBeingEdited.set(null)"
      (save)="
            applicationBeingEdited()?.id
              ? applicationService.edit$.next({
                id: applicationBeingEdited()!.id!,
                data: $event
              })
              : applicationService.add$.next({
                item: $event,
                customerId: applicationBeingEdited()!.customerId!
              })
          "
    />
  `,
  styles: [`
    .wrapper {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 1rem;
    }

    .list-header {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;

      padding: .5rem 1rem;
      user-select: none;

      h4 {
        margin: 0;
      }
    }
  `]
})
export default class HomeComponent {

  // --- Dependencies
  public customerService: CustomerService = inject(CustomerService);
  public applicationService: ApplicationService = inject(ApplicationService);

  // Track the customer that is currently being edited
  public customerBeingEdited = signal<Partial<Customer> | null>(null);

  // Track the application that is currently being edited
  public applicationBeingEdited = signal<Partial<Application> | null>(null);

}
