import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/billing-dashboard.component'),
  },
];

export default routes;
