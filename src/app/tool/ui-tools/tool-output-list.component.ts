import {Component, input, output} from '@angular/core';
import {RemoveToolOutput, ToolOutput} from "../../shared/interfaces";

@Component({
  selector: 'app-tool-output-list',
  standalone: true,
  imports: [],
  template: `
    <ul>

      <li>
        <p>Tool Outputs:</p>
        <button class="button-success" (click)="add.emit()">Add Tool Output</button>
      </li>

      @for (toolOutput of toolOutputs(); track toolOutput.id) {
        <li>
          <div>
            <p>
              <span>Name: </span>{{ toolOutput.name }}
            </p>

            <p>
              <span>Type: </span>{{ toolOutput.type }}
            </p>
          </div>

          <div>
            <button class="button-success small-button" (click)="edit.emit(toolOutput)"><i class="fa-solid fa-pen"></i></button>
            <button class="button-danger small-button" (click)="delete.emit(toolOutput.id)"><i class="fa-solid fa-trash"></i></button>
          </div>
        </li>
      } @empty {
        <p>Click the add button to create your first tool output.</p>
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
        display: grid;
        grid-template-columns: minmax(0, .8fr) minmax(0, .2fr);
        gap: 1rem;
        padding: 1rem;

        font-size: 1.2em;
        background: var(--color-light);
        list-style-type: none;
        margin-bottom: 1rem;

        div {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        button {
          margin-left: 1rem;
        }

        span {
          font-weight: 500;
        }
      }

      p {
        margin: 0;
        padding: 0;
      }
    `,
  ]
})
export class ToolOutputListComponent {

  // --- Inputs
  toolOutputs = input.required<ToolOutput[]>();

  // --- Outputs
  add = output();
  edit = output<ToolOutput>();
  delete = output<RemoveToolOutput>()

}
