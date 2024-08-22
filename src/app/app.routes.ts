import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'customer',
    loadComponent: () => import('./customer/customer.component')
  },
  {
    path: '',
    redirectTo: 'customer',
    pathMatch: 'full',
  },
];
