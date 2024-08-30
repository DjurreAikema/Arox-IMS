import {Component, computed, inject} from '@angular/core';
import {ToolService} from "./data-access/tool.service";
import {ToolInputService} from "./data-access/tool-input.service";
import {ToolOutputService} from "./data-access/tool-output.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-tool-execute',
  standalone: true,
  imports: [
    RouterLink
  ],
  template: `
    <!-- Header -->
    @if (tool(); as tool) {
      <header>
        <button class="button-primary" routerLink="/application/{{tool.applicationId}}">< Back</button>

        <h1>Tool: {{ tool.name }}</h1>
      </header>
    }
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
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 1rem;
      padding: 1rem;
    }
  `]
})
export default class ToolExecuteComponent {

  // --- Dependencies
  protected toolService: ToolService = inject(ToolService);
  protected toolInputService: ToolInputService = inject(ToolInputService);
  protected toolOutputService: ToolOutputService = inject(ToolOutputService);

  private route: ActivatedRoute = inject(ActivatedRoute);

  // --- Properties
  public params = toSignal(this.route.paramMap);

  // Get the tool by the id in the url parameters
  public tool = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.toolService
      .tools()
      .find((tool) => tool.id === id);
  });

  // --- ToolInputs
  public toolInputs = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.toolInputService
      .toolInputs()
      .filter((toolInput) => toolInput.toolId == id)
  });

  // --- ToolOutputs
  public toolOutputs = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.toolOutputService
      .toolOutputs()
      .filter((toolOutput) => toolOutput.toolId == id)
  });
}
