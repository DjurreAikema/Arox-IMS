import {Component, inject} from '@angular/core';
import {ToolService} from "./data-access/tool.service";
import {ToolListComponent} from "./ui-tools/tool-list.component";

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [
    ToolListComponent
  ],
  template: `
    <!-- Header -->
    <header>
      <h1>Tools</h1>
    </header>

    <!-- List -->
    <section>
      <app-tool-list
        [tools]="toolService.tools()"
        [hasAddCard]="false"
        (delete)="toolService.remove$.next($event)"
      />
    </section>
  `,
  styles: [`
    header {
      display: flex;
      flex-flow: row nowrap;

      justify-content: space-between;
      align-items: center;

      padding: 0 1rem;

      border-bottom: 1px solid var(--color-dark);
    }

    h1 {
      margin: 0;
      font-size: 1.8em;
    }

    section {
      padding: 1rem;
      height: calc(100vh - 120px);
      overflow-y: auto;
    }
  `]
})
// Responsibility: Smart component in charge of all tool interactions
export default class ToolsComponent {

  // --- Dependencies
  public toolService: ToolService = inject(ToolService);

}
