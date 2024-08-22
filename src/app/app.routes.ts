import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'customers',
    loadComponent: () => import('./customer/customers.component')
  },
  {
    path: 'customer/:id',
    loadComponent: () => import('./customer/customer-details.component')
  },
  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full',
  },
];
