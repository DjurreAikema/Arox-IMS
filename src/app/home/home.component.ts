import {Component, computed, inject, signal} from '@angular/core';
import {CustomerService} from "../customer/data-access/customer.service";
import {ApplicationService} from "../application/data-access/application.service";
import {Application, Customer, RemoveCustomer, RemoveTool, Tool} from "../shared/interfaces";
import {CustomerFormComponent} from "../customer/ui/customer-form.component";
import {MatTooltip} from "@angular/material/tooltip";
import {ApplicationFormComponent} from "../application/ui/application-form.component";
import {MatAccordion} from "@angular/material/expansion";
import {CustomerExpansionPanelComponent} from "./ui/customer-expansion-panel.component";
import {ToolService} from "../tool/data-access/tool.service";
import {ToolListComponent} from "./ui/tool-list.component";
import {MatCard, MatCardContent} from "@angular/material/card";
import {ToolFormComponent} from "../tool/ui-tools/tool-form.component";
import {ConfirmModalComponent} from "../shared/ui/modals/confirm-modal.component";
import {ModalComponent} from "../shared/ui/modals/modal.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CustomerFormComponent,
    MatTooltip,
    ApplicationFormComponent,
    MatAccordion,
    CustomerExpansionPanelComponent,
    ToolListComponent,
    MatCard,
    MatCardContent,
    ToolFormComponent,
    ConfirmModalComponent,
    ModalComponent
  ],
  template: `
    <div class="wrapper">

      <!-- Customer/Application section -->
      <section>
        <!-- Customer/Application section header -->
        <header class="list-header">
          <h4>Customers and Applications</h4>

          <button class="button-success small-button" (click)="customerBeingEdited.set({})"
                  matTooltip="Quick add customer" matTooltipPosition="right">
            <i class="fa-solid fa-plus"></i>
          </button>
        </header>

        <!-- Customer/Application list -->
        @if (customerService.loaded()) {
          <mat-accordion>
            @for (customer of customerService.customers(); track customer.id) {
              <app-customer-expansion-panel
                [customer]="customer"
                [applications]="applicationService.applications()"
                [selectedApplication]="selectedApplication()"

                (editCustomer)="customerBeingEdited.set($event)"
                (deleteCustomer)="customerToDelete.set($event);"

                (addApplication)="applicationBeingEdited.set({customerId: $event})"
                (editApplication)="applicationBeingEdited.set($event)"
                (selectApplication)="selectedApplication.set($event)"
                (deleteApplication)="applicationService.remove$.next($event)"
              />
            } @empty {
              <mat-card>
                <mat-card-content class="add-card-content">
                  No customers found.
                </mat-card-content>
              </mat-card>
            }
          </mat-accordion>
        } @else {
          <mat-card>
            <mat-card-content class="add-card-content">
              Loading customers.
              <!-- TODO: Better loading indication -->
            </mat-card-content>
          </mat-card>
        }

      </section>

      <!-- Tools section -->
      <section>

        <!-- Tools section header -->
        <header class="list-header">
          <h4>Tools {{ selectedApplication() ? 'for ' + selectedApplication()?.name : '' }}</h4>

          @if (selectedApplication()) {
            <button class="button-success small-button" (click)="toolBeingEdited.set({applicationId: selectedApplication()!.id})"
                    matTooltip="Quick add tool" matTooltipPosition="right">
              <i class="fa-solid fa-plus"></i>
            </button>
          }
        </header>

        <!-- Tools list -->
        <app-tool-list
          [tools]="tools()"
          (edit)="toolBeingEdited.set($event)"
          (delete)="toolToDelete.set($event)"
        />

      </section>

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

    <!-- Customer delete modal -->
    <app-modal [isOpen]="!!customerToDelete()">
      <ng-template>

        <app-confirm-modal
          title="Delete Customer"
          message="Are you sure you want to delete this customer?"
          (confirm)="handleDeleteCustomer()"
          (cancel)="customerToDelete.set(null)"
        />

      </ng-template>
    </app-modal>

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

    <!-- Tool form modal -->
    <app-tool-form
      [toolBeingEdited]="toolBeingEdited()"
      (close)="toolBeingEdited.set(null)"
      (save)="
            toolBeingEdited()?.id
              ? toolService.edit$.next({
                id: toolBeingEdited()!.id!,
                data: $event
              })
              : toolService.add$.next({
                item: $event,
                applicationId: toolBeingEdited()!.applicationId!
              })
          "
    />

    <!-- Tool delete modal -->
    <app-modal [isOpen]="!!toolToDelete()">
      <ng-template>

        <app-confirm-modal
          title="Delete Tool"
          message="Are you sure you want to delete this tool?"
          (confirm)="deleteTool()"
          (cancel)="toolToDelete.set(null)"
        />

      </ng-template>
    </app-modal>
  `,
  styles: [`
    .wrapper {
      height: 100%;
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

    mat-card {
      padding: 1rem;
      max-height: 200px;
      background-color: var(--color-light);
      border-radius: 0;
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
      overflow-y: auto;
      overflow-x: hidden;
      text-overflow: ellipsis;
      height: 100%;
    }

    .add-card-content {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    section {
      height: 100%;
      overflow-y: auto;
    }
  `]
})
export default class HomeComponent {

  // --- Dependencies
  public customerService: CustomerService = inject(CustomerService);
  public applicationService: ApplicationService = inject(ApplicationService);
  public toolService: ToolService = inject(ToolService);

  // Track the customer that is currently being edited
  protected customerBeingEdited = signal<Partial<Customer> | null>(null);

  // Track the application that is currently being edited
  protected applicationBeingEdited = signal<Partial<Application> | null>(null);

  // Track the tool that is currently being edited
  protected toolBeingEdited = signal<Partial<Tool> | null>(null);

  protected selectedApplication = signal<Application | null>(null);

  protected tools = computed(() => {
    return this.toolService
      .tools()
      .filter((tool) => tool.applicationId == this.selectedApplication()?.id)
  });

  // Deleting customers
  protected customerToDelete = signal<RemoveCustomer | null>(null);

  protected handleDeleteCustomer() {
    if (this.customerToDelete()) {
      this.customerService.remove$.next(this.customerToDelete()!)
      this.customerToDelete.set(null);
    }
  }

  // Deleting tools
  protected toolToDelete = signal<RemoveTool | null>(null);

  protected deleteTool() {
    if (this.toolToDelete()) {
      this.toolService.remove$.next(this.toolToDelete()!);
      this.toolToDelete.set(null);
    }
  }
}
