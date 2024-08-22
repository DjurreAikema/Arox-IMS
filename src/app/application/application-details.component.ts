import {Component, computed, inject} from '@angular/core';
import {ApplicationService} from "./data-access/application.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink
  ],
  template: `
    @if (application(); as application) {
      {{ application | json }}
    } @else {
      <p>No application</p>
    }
  `,
  styles: ``
})
// Responsibility: Smart component in charge of showing a application details
// Get the application by its id, get this id from the url parameters
export default class ApplicationDetailsComponent {

  // --- Dependencies
  public applicationService: ApplicationService = inject(ApplicationService);

  private route: ActivatedRoute = inject(ActivatedRoute);

  // --- Properties
  public params = toSignal(this.route.paramMap);

  // Get the application by the id in the url parameters
  public application = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.applicationService
      .applications()
      .find((application) => application.id === id);
  });
}
