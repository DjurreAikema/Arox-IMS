import {Component, input, output} from '@angular/core';
import {Application} from "../../shared/interfaces";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-application-expansion-panel-item',
  standalone: true,
  imports: [
    MatTooltip
  ],
  template: `
    <div class="expansion-panel-item"
         [class.selected]="selected()"
         (click)="select.emit(application())">

      <p>
        {{ application().name }}
      </p>

      <div class="panel-buttons">
        <button class="button-info small-button" (click)="onButtonClick($event)"
                matTooltip="Edit application" matTooltipPosition="right">
          <i class="fa-solid fa-pen"></i>
        </button>
      </div>

    </div>
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

  // --- Functions
  protected onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.edit.emit(this.application());
  }

}
