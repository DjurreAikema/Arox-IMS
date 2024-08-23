import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="wrapper" [class.sidebar-expanded]="isSidebarExpanded">

      <div class="navbar-logo">
        Logo
      </div>

      <div class="navbar">
        <a class="nav-button" routerLink="customers">Customers</a>
        <a class="nav-button" routerLink="applications">Applications</a>
        <a class="nav-button" routerLink="tools">Tools</a>
      </div>

      <div class="sidebar">
        <button class="button-primary" (click)="toggleSidebar()">Toggle Sidebar</button>
      </div>

      <div class="body">
        <router-outlet/>
      </div>

    </div>
  `,
  styleUrls: ['./app.component-sidebar.scss', "./app.component-navbar.scss"],
  styles: [`
    .wrapper {
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr);
      grid-template-rows: 50px minmax(0, 1fr);
      grid-template-areas:
        "navbar-logo navbar"
        "sidebar body";

      justify-items: stretch;
      align-items: stretch;

      justify-content: stretch;
      align-content: stretch;

      // dvh might not work on older browsers
      height: 100dvh;
      width: 100dvw;
    }

    .wrapper.sidebar-expanded .sidebar {
      width: 440px;
    }

    // Body (bottom right)
    .body {
      grid-area: body;
      overflow: hidden;
      padding: 5px;

      background-color: var(--color-penumbra);
    }
  `],
})
export class AppComponent {

  protected isSidebarExpanded = false;

  protected toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}
