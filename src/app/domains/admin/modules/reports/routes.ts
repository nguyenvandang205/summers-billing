import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'spending' },
  {
    path: 'spending',
    loadComponent: () =>
      import('./features/reports-spending/reports-spending.component'),
  },
  {
    path: 'usage',
    loadComponent: () =>
      import('./features/reports-usage/reports-usage.component'),
  },
  { path: 'forecast', redirectTo: 'spending' },
];

export default routes;
