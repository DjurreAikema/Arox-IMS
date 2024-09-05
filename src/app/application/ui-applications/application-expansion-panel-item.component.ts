import {Component, input, output} from '@angular/core';
import {Application} from "../../shared/interfaces";

@Component({
  selector: 'app-application-expansion-panel-item',
  standalone: true,
  imports: [],
  template: `
    <div class="expansion-panel-item"
         [class.selected]="selected()"
         (click)="select.emit(application().id)">

      <p>
        {{ application().name }}
      </p>

      <div class="panel-buttons">
        <button class="button-success small-button" (click)="onButtonClick($event)">
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
  select = output<number>();

  // --- Functions
  protected clickTest() {
    console.log("clicked")
  }

  protected onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    console.log("button clicked");
  }

}
