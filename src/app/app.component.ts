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
      height: 50px;
      background-color: lightblue;
    }
  `],
})
export class AppComponent {
}
