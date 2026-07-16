import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account' },
  {
    path: 'account',
    loadComponent: () => import('./features/account-settings.component'),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notifications-settings.component'),
  },
  {
    path: 'security',
    loadComponent: () => import('./features/security/security-settings.component'),
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./features/payments/settings-payment.component'),
  },
  { path: 'payment-methods', redirectTo: 'payment' },
  { path: 'team', redirectTo: 'account' },
  { path: 'plan-and-billing', redirectTo: '/billing/plan' },
];

export default routes;
