import {Component, input} from '@angular/core';

@Component({
  selector: 'app-expansion-panel-list-header',
  standalone: true,
  imports: [],
  template: `
    <div class="expansion-panel-item">

      <p>
        {{ text() }}
      </p>

      <ng-content class="panel-buttons"></ng-content>

    </div>
  `,
  styles: [`
    .expansion-panel-item {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;

      padding: 5px 1rem;
      margin-bottom: 5px;
      border-bottom: 1px solid var(--color-secondary);
      user-select: none;

      p {
        margin: 0;
        font-weight: 550;
      }
    }
  `]
})
// Responsibility: TODO
export class ExpansionPanelListHeaderComponent {

  // --- Inputs
  text = input.required<string>();

}
