import {Component, effect, input, output} from '@angular/core';
import {Application} from "../../shared/interfaces";
import {FormModalComponent} from "../../shared/ui/modals/form-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";
import {CustomFormGroup} from "../../shared/utils/custom-form-group";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    FormModalComponent,
    ModalComponent
  ],
  template: `
    <app-modal [isOpen]="!!applicationBeingEdited()">
      <ng-template>

        <app-form-modal
          [formGroup]="applicationForm"
          [title]="
            applicationBeingEdited()?.name
                ? applicationBeingEdited()!.name!
                : 'Add application'
          "
          (close)="close.emit()"
          (save)="save.emit(applicationForm.getRawValue())"
        />

      </ng-template>
    </app-modal>
  `,
  styles: ``
})
export class ApplicationFormComponent {

  // --- Inputs
  applicationBeingEdited = input<Partial<Application> | null>(null);

  // --- Outputs
  close = output();
  save = output<{ name: string }>();

  // Form for creating/editing applications
  public applicationForm = new CustomFormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  }, {
    // Extra control info
    name: {
      label: 'Name',
      placeholder: 'Application name'
    },
  });

  constructor() {
    // Reset `applicationForm` when `applicationBeingEdited()` is null
    effect((): void => {
      const application: Partial<Application> | null = this.applicationBeingEdited();
      if (!application) this.applicationForm.reset(); // Imperative code
      else {
        this.applicationForm.patchValue({
          ...application
        });
      }
    });
  }
}
