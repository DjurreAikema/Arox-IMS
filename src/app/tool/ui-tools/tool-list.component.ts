import {Component, input, output} from '@angular/core';
import {Tool, RemoveTool} from "../../shared/interfaces";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  template: `
    <ul>
      @for (tool of tools(); track tool.id) {
        <li>

          <a routerLink="/tool/{{tool.id}}">
            {{ tool.name }}
          </a>

          <div>
            <button class="button-success" (click)="edit.emit(tool)">Edit</button>
            <button class="button-danger" (click)="delete.emit(tool.id)">Delete</button>
          </div>

        </li>
      } @empty {
        <p>No tools found, click the add button to create your first tool.</p>
      }
    </ul>
  `,
  styles: [
    `
      ul {
        padding: 0;
        margin: 0;
      }

      li {
        display: flex;
        justify-content: space-between;

        font-size: 1.2em;
        background: var(--color-light);
        list-style-type: none;
        margin-bottom: 1rem;
        padding: 1rem;

        button {
          margin-left: 1rem;
        }
      }
    `,
  ]
})
// responsibility: Dumb component that displays a list of tools
export class ToolListComponent {

  // --- Inputs
  tools = input.required<Tool[]>();

  // --- Outputs
  edit = output<Tool>();
  delete = output<RemoveTool>();

}
