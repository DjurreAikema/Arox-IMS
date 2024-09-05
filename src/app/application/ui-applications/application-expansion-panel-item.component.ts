import {Component, input} from '@angular/core';
import {Application} from "../../shared/interfaces";

@Component({
  selector: 'app-application-expansion-panel-item',
  standalone: true,
  imports: [],
  template: `
    <p>
      {{ application().name }}
    </p>
  `,
  styles: ``
})
export class ApplicationExpansionPanelItemComponent {

  // --- Inputs
  application = input.required<Application>();

}
