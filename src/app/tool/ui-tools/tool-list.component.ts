import {Component, input, output} from '@angular/core';
import {Tool, RemoveTool} from "../../shared/interfaces";
import {RouterLink} from "@angular/router";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle
  ],
  template: `
    <div class="list">
      @for (tool of tools(); track tool.id) {

        <mat-card>

          <mat-card-header>
            <mat-card-title>{{ tool.name }}</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <p>Description</p>
          </mat-card-content>

          <mat-card-footer>
            <button class="button-danger small-button" (click)="delete.emit(tool.id)">
              <i class="fa-solid fa-trash"></i>
            </button>

            <div>
              <button class="button-success small-button" (click)="edit.emit(tool)">
                <i class="fa-solid fa-pen"></i>
              </button>

              <button class="button-primary" routerLink="/tool/{{tool.id}}">
                Open
              </button>

              <button class="button-warning">
                Execute
              </button>
            </div>

          </mat-card-footer>

        </mat-card>
      } @empty {
        @if (!hasAddCard()) {
          <mat-card>
            <mat-card-content class="add-card-content">
              No tools found.
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

}
