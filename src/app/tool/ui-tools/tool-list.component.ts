import {Component, input, output, signal} from '@angular/core';
import {Tool, RemoveTool} from "../../shared/interfaces";
import {RouterLink} from "@angular/router";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {ConfirmModalComponent} from "../../shared/ui/modals/confirm-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";

@Component({
  selector: 'app-tool-list',
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
      @for (tool of tools(); track tool.id) {

        <!-- Tool card -->
        <mat-card>

          <mat-card-header>
            <mat-card-title>{{ tool.name }}</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <ul>
              <li>ApiEndpoint: </li>
              <span>{{ tool.apiEndpoint }}</span>
            </ul>
          </mat-card-content>

          <mat-card-footer>
            <div>
              <button class="button-danger small-button" (click)="toolToDelete.set(tool.id)">
                <i class="fa-solid fa-trash"></i>
              </button>

              <button class="button-success small-button" (click)="edit.emit(tool)">
                <i class="fa-solid fa-pen"></i>
              </button>
            </div>

            <div>
              <button class="button-primary" routerLink="/tool/{{tool.id}}">
                Open
              </button>

              <button class="button-warning" routerLink="/tool/{{tool.id}}/execute">
                Execute
              </button>
            </div>
          </mat-card-footer>

        </mat-card>
      } @empty {
        @if (!hasAddCard()) {
          <!-- No tools found card -->
          <mat-card>
            <mat-card-content class="add-card-content">
              No tools found.
            </mat-card-content>
          </mat-card>
        }
      }

      @if (hasAddCard()) {
        <!-- Add card -->
        <mat-card class="add-card" (click)="add.emit()">

          <mat-card-content class="add-card-content">
            <i class="fa-solid fa-plus"></i>
          </mat-card-content>

        </mat-card>
      }
    </div>

    <!-- Delete modal -->
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
  styleUrls: ['../../shared/styles/default-list.scss'],
  styles: [``]
})
// responsibility: Dumb component that displays a list of tools
export class ToolListComponent {

  // --- Inputs
  tools = input.required<Tool[]>();
  hasAddCard = input<Boolean>(true);

  // --- Outputs
  add = output();
  edit = output<Tool>();
  delete = output<RemoveTool>();

  // --- Properties
  protected toolToDelete = signal<RemoveTool | null>(null);

  protected deleteTool() {
    if (this.toolToDelete()) {
      this.delete.emit(this.toolToDelete()!)
      this.toolToDelete.set(null);
    }
  }
}
