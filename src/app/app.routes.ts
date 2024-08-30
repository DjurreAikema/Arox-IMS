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
  // Tool routes
  {
    path: 'tools',
    loadComponent: () => import('./tool/tools.component')
  },
  {
    path: 'tool/:id',
    loadComponent: () => import('./tool/tool-details.component')
  },
  {
    path: 'tool/:id/execute',
    loadComponent: () => import('./tool/tool-execute.component')
  },
  // Default route
  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full',
  },
];
