import {Routes} from '@angular/router';

export const routes: Routes = [
  // Customer routes
  {
    path: 'customers',
    loadComponent: () => import('./customer/customers.component')
  },
  {
    path: 'customer/:id',
    loadComponent: () => import('./customer/customer-details.component')
  },
  // Application routes
  {
    path: 'applications',
    loadComponent: () => import('./application/applications.component')
  },
  {
    path: 'application/:id',
    loadComponent: () => import('./application/application-details.component')
  },
  // Default route
  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full',
  },
];
