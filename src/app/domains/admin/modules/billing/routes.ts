import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'plan' },
  { path: 'plan', loadComponent: () => import('./features/plan/billing-plan.component') },
  { path: 'addons', loadComponent: () => import('./features/addons/billing-addons.component') },
  { path: 'usage', loadComponent: () => import('./features/usage/billing-usage.component') },
  { path: 'invoices', loadComponent: () => import('./features/invoices/billing-invoices.component') },
  { path: 'payment-methods', redirectTo: '/settings/payment' },
  { path: 'transactions', redirectTo: 'invoices' },
];

export default routes;
