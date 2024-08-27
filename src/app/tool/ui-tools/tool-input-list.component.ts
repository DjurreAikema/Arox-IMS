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

      <li>
        <button class="button-success" (click)="add.emit()">Add</button>
      </li>

      @for (toolInput of toolInputs(); track toolInput.id) {
        <li>
          <p>
            Name: {{ toolInput.name }}
          </p>

          <p>
            Label: {{ toolInput.label }}
          </p>

          <p>
            Type: {{ toolInput.type }}
          </p>

          <div>
            <button class="button-success small-button" (click)="edit.emit(toolInput)"><i class="fa-solid fa-pen"></i></button>
            <button class="button-danger small-button" (click)="delete.emit(toolInput.id)"><i class="fa-solid fa-trash"></i></button>
          </div>
        </li>
      } @empty {
        <p>Click the add button to create your first tool input.</p>
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
        font-size: 1.2em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--color-light);
        list-style-type: none;
        margin-bottom: 1rem;
        padding: 1rem;

        button {
          margin-left: 1rem;
        }
      }

      p {
        margin: 0;
        padding: 0;
      }
    `,
  ]
})
export class ToolInputListComponent {

  // --- Inputs
  toolInputs = input.required<ToolInput[]>();

  // --- Outputs
  add = output();
  edit = output<ToolInput>();
  delete = output<RemoveToolInput>()

}
