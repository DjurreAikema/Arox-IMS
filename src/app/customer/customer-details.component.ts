import {Component, computed, effect, inject, signal} from '@angular/core';
import {CustomerService} from "./data-access/customer.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {JsonPipe} from "@angular/common";
import {ApplicationService} from "../application/data-access/application.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Application} from "../shared/interfaces";
import {ApplicationListComponent} from "../application/ui-applications/application-list.component";
import {ModalComponent} from "../shared/ui/modal.component";
import {FormModalComponent} from "../shared/ui/form-modal.component";

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    ApplicationListComponent,
    ModalComponent,
    FormModalComponent
  ],
  template: `
    @if (customer(); as customer) {
      <header>
        <button class="button-primary" routerLink="/customers">< Back</button>

        <h1>{{ customer.name }}</h1>

        <button class="button-primary" (click)="applicationBeingEdited.set({})">Add Application +</button>
      </header>
    }

    <section>
      <app-application-list
        [applications]="applications()"
        (add)="applicationBeingEdited.set({})"
        (edit)="applicationBeingEdited.set($event)"
        (delete)="applicationService.remove$.next($event)"
      />
    </section>

    <app-modal [isOpen]="!!applicationBeingEdited()">
      <ng-template>
        <app-form-modal
          [formGroup]="applicationForm"
          [title]="
            applicationBeingEdited()?.name
                ? applicationBeingEdited()!.name!
                : 'Add application'
          "
          (close)="applicationBeingEdited.set(null)"
          (save)="
            applicationBeingEdited()?.id
              ? applicationService.edit$.next({
                id: applicationBeingEdited()!.id!,
                data: applicationForm.getRawValue()
              })
              : applicationService.add$.next({
                item: applicationForm.getRawValue(),
                customerId: customer()?.id!
              })
          "
        />
      </ng-template>
    </app-modal>
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
      height: calc(100vh - 120px);
      overflow-y: auto;
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
  private fb: FormBuilder = inject(FormBuilder);

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

  // Form for creating/editing applications
  public applicationForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor() {
    // Reset `applicationForm` when `applicationBeingEdited()` is null
    effect((): void => {
      const application: Partial<Application> | null = this.applicationBeingEdited();
      if (!application) this.applicationForm.reset(); // Imperative code
      else {
        this.applicationForm.patchValue({
          name: application.name
        });
      }
    });
  }
}
