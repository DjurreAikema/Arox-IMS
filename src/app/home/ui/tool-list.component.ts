import {Component, input, output} from '@angular/core';
import {RemoveTool, Tool} from "../../shared/interfaces";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {RouterLink} from "@angular/router";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle,
    RouterLink,
    MatTooltip
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
            <li>ApiEndpoint:</li>
            <span>{{ tool.apiEndpoint }}</span>
          </ul>
        </mat-card-content>

        <mat-card-footer>

          <div>
            <button class="button-info" routerLink="/tool/{{tool.id}}">
              Edit tool
            </button>

            <button class="button-danger small-button mr-5"
                    matTooltip="Delete tool" matTooltipPosition="right">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>

          <button class="button-warning" routerLink="/tool/{{tool.id}}/execute">
            Execute tool
          </button>

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
  styles: [`
    mat-card {
      margin-bottom: 1rem;
    }
  `]
})
export class ToolListComponent {

  // --- Inputs
  tools = input.required<Tool[]>();

  // --- Outputs
  add = output();
  edit = output<Tool>();
  delete = output<RemoveTool>();

}
