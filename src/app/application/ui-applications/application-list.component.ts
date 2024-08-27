import {Component, input, output, signal} from '@angular/core';
import {Application, RemoveApplication} from "../../shared/interfaces";
import {RouterLink} from "@angular/router";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {ConfirmModalComponent} from "../../shared/ui/confirm-modal.component";
import {ModalComponent} from "../../shared/ui/modal.component";

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle,
    ConfirmModalComponent,
    ModalComponent
  ],
  template: `
    <div class="list">
      @for (application of applications(); track application.id) {

        <mat-card>

          <mat-card-header>
            <mat-card-title>{{ application.name }}</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <p>Description</p>
          </mat-card-content>

          <mat-card-footer>
            <button class="button-danger small-button" (click)="applicationToDelete.set(application.id)">
              <i class="fa-solid fa-trash"></i>
            </button>

            <div>
              <button class="button-success small-button" (click)="edit.emit(application)">
                <i class="fa-solid fa-pen"></i>
              </button>

              <button class="button-primary" routerLink="/application/{{application.id}}">
                Open
              </button>
            </div>

          </mat-card-footer>

        </mat-card>
      } @empty {
        @if (!hasAddCard()) {
          <mat-card>
            <mat-card-content class="add-card-content">
              No applications found.
            </mat-card-content>
          </mat-card>
        }
      }

      @if (hasAddCard()) {
        <mat-card class="add-card" (click)="add.emit()">

          <mat-card-content class="add-card-content">
            <i class="fa-solid fa-plus"></i>
          </mat-card-content>

        </mat-card>
      }
    </div>

    <!-- Delete modal -->
    <app-modal [isOpen]="!!applicationToDelete()">
      <ng-template>
        <app-confirm-modal
          title="Delete Application"
          message="Are you sure you want to delete this application?"
          (confirm)="deleteApplication()"
          (cancel)="applicationToDelete.set(null)"
        />
      </ng-template>
    </app-modal>
  `,
  styleUrls: ['../../shared/styles/default-list.scss'],
  styles: [``]
})
// responsibility: Dumb component that displays a list of applications
export class ApplicationListComponent {

  // --- Inputs
  applications = input.required<Application[]>();
  hasAddCard = input<Boolean>(true);

  // --- Outputs
  add = output();
  edit = output<Application>();
  delete = output<RemoveApplication>();

  // --- Properties
  protected applicationToDelete = signal<RemoveApplication | null>(null);

  protected deleteApplication() {
    if (this.applicationToDelete()) {
      this.delete.emit(this.applicationToDelete()!)
      this.applicationToDelete.set(null);
    }
  }
}
