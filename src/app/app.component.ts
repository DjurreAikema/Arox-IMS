import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="wrapper">

      <nav class="navbar">
        <button class="button-primary" routerLink="/customers">Customers</button>
        <button class="button-primary" routerLink="/applications">Applications</button>
      </nav>

      <router-outlet class="body"/>
    </div>

  `,
  styles: [`
    .wrapper {
      display: flex;
      flex-flow: column nowrap;
    }

    .navbar {
      display: flex;
      flex-flow: row nowrap;
      gap: 1rem;

      align-items: center;

      height: 50px;
      background-color: lightblue;
      padding: 0 1rem;
    }
  `],
})
export class AppComponent {
}
