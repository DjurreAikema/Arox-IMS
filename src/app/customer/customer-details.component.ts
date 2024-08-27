import {Component, computed, inject, signal} from '@angular/core';
import {CustomerService} from "./data-access/customer.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {JsonPipe} from "@angular/common";
import {ApplicationService} from "../application/data-access/application.service";
import {Application} from "../shared/interfaces";
import {ApplicationListComponent} from "../application/ui-applications/application-list.component";
import {MatCard, MatCardContent} from "@angular/material/card";
import {ApplicationFormComponent} from "../application/ui-applications/application-form.component";

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    ApplicationListComponent,
    MatCard,
    MatCardContent,
    ApplicationFormComponent
  ],
  template: `
    <!-- Header -->
    @if (customer(); as customer) {
      <header>
        <button class="button-primary" routerLink="/customers">< Back</button>

        <h1>Customer: {{ customer.name }}</h1>

        <button class="button-success" (click)="applicationBeingEdited.set({})">Add Application +</button>
      </header>

      <mat-card class="list-header">
        <mat-card-content>
          All applications belonging to {{ customer.name }} ({{ applicationService.applicationsCount() }})
        </mat-card-content>
      </mat-card>
    }

    <!-- List -->
    <section>
      <app-application-list
        [applications]="applications()"
        (add)="applicationBeingEdited.set({})"
        (edit)="applicationBeingEdited.set($event)"
        (delete)="applicationService.remove$.next($event)"
      />
    </section>

    <!-- Form modal -->
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
                customerId: customer()?.id!
              })
          "
    />
  `,
  styles: [`
    header {
      display: flex;
      flex-flow: row nowrap;

      justify-content: space-between;
      align-items: center;

      padding: 0 1rem;

      border-bottom: 1px solid var(--color-dark);
    }

    h1 {
      margin: 0;
      font-size: 1.8em;
    }

    section {
      padding: 1rem;
      height: calc(100vh - 200px);
      overflow-y: auto;
    }

    .list-header {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;

      background-color: var(--color-light);
      margin: 1rem 1rem 0 1rem;
      padding: 0;

      mat-card-content {
        padding: 5px;
      }
    }
  `]
})
// Responsibility: Smart component in charge of showing a customers details
// Get the customer by its id, get this id from the url parameters
export default class CustomerDetailsComponent {

  // --- Dependencies
  protected customerService: CustomerService = inject(CustomerService);
  protected applicationService: ApplicationService = inject(ApplicationService);

  private route: ActivatedRoute = inject(ActivatedRoute);

  // --- Properties
  public params = toSignal(this.route.paramMap);

  // Get the customer by the id in the url parameters
  public customer = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.customerService
      .customers()
      .find((customer) => customer.id === id);
  });

  // --- Applications
  // Array of applications for the selected customer
  public applications = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.applicationService
      .applications()
      .filter((application) => application.customerId == id)
  });

  // Track the application that is currently being edited
  public applicationBeingEdited = signal<Partial<Application> | null>(null);
}
