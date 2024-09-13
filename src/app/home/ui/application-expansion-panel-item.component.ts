import {Component, input, output, signal} from '@angular/core';
import {Application, RemoveApplication} from "../../shared/interfaces";
import {MatTooltip} from "@angular/material/tooltip";
import {ConfirmModalComponent} from "../../shared/ui/modals/confirm-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";

@Component({
  selector: 'app-application-expansion-panel-item',
  standalone: true,
  imports: [
    MatTooltip,
    ConfirmModalComponent,
    ModalComponent
  ],
  template: `
    <div class="expansion-panel-item"
         [class.selected]="selected()"
         (click)="select.emit(application())">

      <p>
        {{ application().name }}
      </p>

      <div class="panel-buttons">
        <button class="button-danger small-button mr-5" (click)="applicationToDelete.set(application().id)"
                matTooltip="Delete application" matTooltipPosition="right">
          <i class="fa-solid fa-trash"></i>
        </button>

        <button class="button-info small-button" (click)="onButtonClick($event)"
                matTooltip="Edit application" matTooltipPosition="right">
          <i class="fa-solid fa-pen"></i>
        </button>
      </div>

    </div>

    <!-- Delete modal -->
    <app-modal [isOpen]="!!applicationToDelete()">
      <ng-template>

        <app-confirm-modal
          title="Delete Application"
          message="Are you sure you want to delete this application?"
          (confirm)="handleDeleteApplication()"
          (cancel)="applicationToDelete.set(null)"
        />

      </ng-template>
    </app-modal>
  `,
  styles: [`
    .expansion-panel-item {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;

      padding: 1rem;
      margin-bottom: 5px;
      border-bottom: 1px solid var(--color-secondary);

      p {
        margin: 0;
      }
    }

    .expansion-panel-item:hover {
      cursor: pointer;
      background-color: #ebe9ed;
    }

    .expansion-panel-item.selected {
      background-color: #f0f0f0;
    }
  `]
})
export class ApplicationExpansionPanelItemComponent {

  // --- Inputs
  application = input.required<Application>();
  selected = input.required<Boolean>();

  // --- Outputs
  select = output<Application>();
  edit = output<Application>();
  delete = output<RemoveApplication>()

  // --- Functions
  protected onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.edit.emit(this.application());
  }

  // Deleting applications
  protected applicationToDelete = signal<RemoveApplication | null>(null);

  protected handleDeleteApplication() {
    if (this.applicationToDelete()) {
      this.delete.emit(this.applicationToDelete()!);
      this.applicationToDelete.set(null);
    }
  }

}
