import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notifications' },
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
  { path: 'account', redirectTo: 'notifications' },
  { path: 'team', redirectTo: 'notifications' },
  { path: 'plan-and-billing', redirectTo: '/billing/plan' },
];

export default routes;
