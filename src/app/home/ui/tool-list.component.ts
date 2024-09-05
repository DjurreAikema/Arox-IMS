import {Component, input, output} from '@angular/core';
import {RemoveTool, Tool} from "../../shared/interfaces";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle,
    RouterLink
  ],
  template: `
    @for (tool of tools(); track tool.id) {

      <!-- Tool card -->
      <mat-card>

        <mat-card-header>
          <mat-card-title>{{ tool.name }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <ul>
            <li>ApiUrl:</li>
            <span>{{ tool.apiUrl }}</span>
          </ul>
        </mat-card-content>

        <mat-card-footer>
          <div>
            <button class="button-danger small-button">
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
      <mat-card>
        <mat-card-content class="add-card-content">
          Selected application has no tools.
        </mat-card-content>
      </mat-card>
    }
  `,
  styleUrls: ['../../shared/styles/default-list.scss'],
  styles: ``
})
export class ToolListComponent {

  // --- Inputs
  tools = input.required<Tool[]>();

  // --- Outputs
  add = output();
  edit = output<Tool>();
  delete = output<RemoveTool>();

}
