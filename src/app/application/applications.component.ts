import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ApplicationService} from "./data-access/application.service";
import {Application} from "../shared/interfaces";
import {ApplicationListComponent} from "./ui-applications/application-list.component";
import {FormModalComponent} from "../shared/ui/form-modal.component";
import {ModalComponent} from "../shared/ui/modal.component";

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    ApplicationListComponent,
    FormModalComponent,
    ModalComponent
  ],
  template: `
    <header>
      <h1>Applications</h1>
      <button class="button-primary" (click)="applicationBeingEdited.set({})">Add Application</button>
    </header>

    <section>
      <h2>Your applications</h2>

      <app-application-list
        [applications]="applicationService.applications()"
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
                : applicationService.add$.next(applicationForm.getRawValue())
            "
        />
      </ng-template>
    </app-modal>
  `,
  styles: ``
})
// Responsibility: Smart component in charge of all application interactions
export default class ApplicationsComponent {

  // --- Dependencies
  public fb: FormBuilder = inject(FormBuilder);
  public applicationService: ApplicationService = inject(ApplicationService);

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
