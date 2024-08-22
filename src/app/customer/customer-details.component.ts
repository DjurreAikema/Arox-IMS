import {Component, computed, inject} from '@angular/core';
import {CustomerService} from "./data-access/customer.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink
  ],
  template: `
    <button class="button-primary" routerLink="/customers">Customers</button>

    @if (customer(); as customer) {
      {{ customer | json }}
    } @else {
      <p>No customer</p>
    }
  `,
  styles: ``
})
// Responsibility: Smart component in charge of showing a customers details
// Get the customer by its id, get this id from the url parameters
export default class CustomerDetailsComponent {

  // --- Dependencies
  protected customerService: CustomerService = inject(CustomerService);

  private route: ActivatedRoute = inject(ActivatedRoute);

  // --- Properties
  public params = toSignal(this.route.paramMap);

  // Get the customer by the id in the url parameters
  public customer = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.customerService
      .customers()
      .find((customer) => customer.id === id);
  });
}
