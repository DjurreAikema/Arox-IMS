import {Component, input, output, signal} from '@angular/core';
import {RemoveToolInput, ToolInput, ToolInputTypeEnum} from "../../shared/interfaces";
import {RouterLink} from "@angular/router";
import {ConfirmModalComponent} from "../../shared/ui/confirm-modal.component";
import {ModalComponent} from "../../shared/ui/modal.component";
import {EnumToTextPipe} from "../../shared/pipes/enum-to-text.pipe";

@Component({
  selector: 'app-tool-input-list',
  standalone: true,
  imports: [
    RouterLink,
    ConfirmModalComponent,
    ModalComponent,
    EnumToTextPipe
  ],
  template: `
    <ul>

      <li>
        <p>Tool Inputs:</p>
        <button class="button-success" (click)="add.emit()">Add Tool Input</button>
      </li>

      @for (toolInput of toolInputs(); track toolInput.id) {
        <!-- Tool input -->
        <li>
          <div>
            <p>
              <span>Name: </span>{{ toolInput.name }}
            </p>

            <p>
              <span>Label: </span>{{ toolInput.label }}
            </p>

            <p>
              <span>Type: </span>{{ toolInput.type | enumToText: ToolInputTypeEnum }}
            </p>
          </div>

          <div>
            <button class="button-success small-button" (click)="edit.emit(toolInput)"><i class="fa-solid fa-pen"></i></button>
            <button class="button-danger small-button" (click)="toolInputToDelete.set(toolInput.id)"><i class="fa-solid fa-trash"></i></button>
          </div>
        </li>
      } @empty {
        <p>Click the add button to create your first tool input.</p>
      }
    </ul>

    <!-- Delete modal -->
    <app-modal [isOpen]="!!toolInputToDelete()">
      <ng-template>

        <app-confirm-modal
          title="Delete Tool Input"
          message="Are you sure you want to delete this tool input?"
          (confirm)="deleteToolInput()"
          (cancel)="toolInputToDelete.set(null)"
        />

      </ng-template>
    </app-modal>
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
export class ToolInputListComponent {

  // --- Inputs
  toolInputs = input.required<ToolInput[]>();

  // --- Outputs
  add = output();
  edit = output<ToolInput>();
  delete = output<RemoveToolInput>()

  // --- Properties
  protected toolInputToDelete = signal<RemoveToolInput | null>(null);

  protected deleteToolInput() {
    if (this.toolInputToDelete()) {
      this.delete.emit(this.toolInputToDelete()!)
      this.toolInputToDelete.set(null);
    }
  }

  protected readonly ToolInputTypeEnum = ToolInputTypeEnum;
}
