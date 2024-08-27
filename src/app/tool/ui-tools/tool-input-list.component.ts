import {Component, input, output} from '@angular/core';
import {RemoveToolInput, ToolInput} from "../../shared/interfaces";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-tool-input-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  template: `
    <ul>
      @for (toolInput of toolInputs(); track toolInput.id) {
        <li>
          <!--          <a routerLink="/checklist/{{checklist.id}}">-->
          <!--            {{ checklist.title }}-->
          <!--          </a>-->
          <p>
            {{ toolInput.name }}
          </p>

          <div>
            <button (click)="edit.emit(toolInput)">Edit</button>
            <button (click)="delete.emit(toolInput.id)">Delete</button>
          </div>
        </li>
      } @empty {
        <p>Click the add button to create your first checklist!</p>
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
        font-size: 1.5em;
        display: flex;
        justify-content: space-between;
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
export class ToolInputListComponent {

  // --- Inputs
  toolInputs = input.required<ToolInput[]>();

  // --- Outputs
  edit = output<ToolInput>();
  delete = output<RemoveToolInput>()

}
