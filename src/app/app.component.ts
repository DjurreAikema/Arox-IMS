import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="wrapper">

      <div class="navbar-logo">
        Logo
      </div>

      <div class="navbar">
        <a class="nav-button" routerLink="customers">Customers</a>
        <a class="nav-button" routerLink="applications">Applications</a>
        <a class="nav-button" routerLink="tools">Tools</a>
      </div>

      <div class="sidebar">
        Sidebar
      </div>

      <div class="body">
        <router-outlet/>
      </div>

    </div>
  `,
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

    .navbar-general {
      background-color: var(--color-dark);
      border-bottom: 5px solid var(--color-secondary);
      color: white;
    }

    // Logo (top left)
    .navbar-logo {
      grid-area: navbar-logo;
      overflow: hidden;

      display: flex;
      justify-content: center;
      align-items: center;

      @extend .navbar-general;
    }

    // Navbar (top right)
    .navbar {
      grid-area: navbar;
      overflow: hidden;

      display: flex;
      justify-content: flex-start;
      align-items: center;

      @extend .navbar-general;
    }

    .nav-button {
      height: 100%;
      padding: 0 1rem;

      text-decoration: none;
      color: white;

      display: flex;
      flex-flow: row nowrap;
      align-items: center;
    }

    .nav-button:hover {
      background-color: #2e2f61; // Lighter version of --color-dark
      cursor: pointer;
    }

    // Sidebar (bottom left)
    .sidebar {
      grid-area: sidebar;
      overflow: hidden;

      padding: 1rem;
      border-right: 1px solid var(--color-dark);
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
}
