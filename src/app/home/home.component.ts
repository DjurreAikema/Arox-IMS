import {Component, inject} from '@angular/core';
import {CustomerExpansionPanelListComponent} from "../customer/ui-customers/customer-expansion-panel-list.component";
import {CustomerService} from "../customer/data-access/customer.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CustomerExpansionPanelListComponent
  ],
  template: `
    <div class="wrapper">

      <div>
        <h4>Customers and Applications</h4>

        <app-customer-expansion-panel-list
          [customers]="customerService.customers()"
        />
      </div>

      <div>
        <h4>Tools</h4>
        right side
      </div>

    </div>

  `,
  styles: [`
    .wrapper {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 1rem;
    }
  `]
})
export default class HomeComponent {

  // --- Dependencies
  public customerService: CustomerService = inject(CustomerService);

}
