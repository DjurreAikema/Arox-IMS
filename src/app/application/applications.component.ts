import {Component, inject} from '@angular/core';
import {ApplicationService} from "./data-access/application.service";
import {ApplicationListComponent} from "./ui-applications/application-list.component";

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    ApplicationListComponent,
  ],
  template: `
    <!-- Header -->
    <header>
      <h1>Applications</h1>
    </header>

    <!-- List -->
    <section>
      <app-application-list
        [applications]="applicationService.applications()"
        [hasAddCard]="false"
        (delete)="applicationService.remove$.next($event)"
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
// Responsibility: Smart component in charge of all application interactions
export default class ApplicationsComponent {

  // --- Dependencies
  public applicationService: ApplicationService = inject(ApplicationService);

}
