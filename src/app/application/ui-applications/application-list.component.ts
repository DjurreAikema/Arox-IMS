import {Component, input, output} from '@angular/core';
import {Application, RemoveApplication} from "../../shared/interfaces";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  template: `
    <ul>
      @for (application of applications(); track application.id) {
        <li>

          <a routerLink="/application/{{application.id}}">
            {{ application.name }}
          </a>

          <div>
            <button class="button-success" (click)="edit.emit(application)">Edit</button>
            <button class="button-danger" (click)="delete.emit(application.id)">Delete</button>
          </div>

        </li>
      } @empty {
        <p>No customers found, click the add button to create your first customer.</p>
      }
    </ul>
  `,
  styles: [
    `
      ul {
        padding: 0;
        margin: 0;
      }

      li {
        display: flex;
        justify-content: space-between;

        font-size: 1.2em;
        background: var(--color-light);
        list-style-type: none;
        margin-bottom: 1rem;
        padding: 1rem;

        button {
          margin-left: 1rem;
        }
      }
    `,
  ]
})
// responsibility: Dumb component that displays a list of applications
export class ApplicationListComponent {

  // --- Inputs
  applications = input.required<Application[]>();

  // --- Outputs
  edit = output<Application>();
  delete = output<RemoveApplication>();
}
