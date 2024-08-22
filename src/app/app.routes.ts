import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'customers',
    loadComponent: () => import('./customer/customers.component')
  },
  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full',
  },
];
