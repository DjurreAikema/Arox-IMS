import {Component, computed, inject} from '@angular/core';
import {ToolService} from "./data-access/tool.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-tool-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink
  ],
  template: `
    @if (tool(); as tool) {
      {{ tool | json }}
    } @else {
      <p>No tool</p>
    }
  `,
  styles: ``
})
// Responsibility: Smart component in charge of showing a tool's details
// Get the tool by its id, get this id from the url parameters
export default class ToolDetailsComponent {

  // --- Dependencies
  protected toolService: ToolService = inject(ToolService);

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
}
