import { Route } from '@angular/router';

const legacyAdminRedirects: Route[] = [
  { path: 'admin', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'admin/dashboard', redirectTo: 'dashboard' },
  { path: 'admin/billing/plan', redirectTo: 'billing/plan' },
  { path: 'admin/billing/addons', redirectTo: 'billing/addons' },
  { path: 'admin/billing/usage', redirectTo: 'billing/usage' },
  { path: 'admin/billing/invoices', redirectTo: 'billing/invoices' },
  { path: 'admin/billing/payment-methods', redirectTo: 'settings/payment' },
  { path: 'admin/reports/spending', redirectTo: 'reports/spending' },
  { path: 'admin/reports/usage', redirectTo: 'reports/usage' },
  { path: 'admin/organization', redirectTo: 'dashboard' },
  {
    path: 'admin/settings/notifications',
    redirectTo: 'settings/notifications',
  },
  { path: 'admin/settings/security', redirectTo: 'settings/security' },
  { path: 'admin/settings/payment', redirectTo: 'settings/payment' },
  { path: 'admin/subscription', pathMatch: 'full', redirectTo: 'billing/plan' },
  { path: 'admin/subscription/plan', redirectTo: 'billing/plan' },
  { path: 'admin/subscription/addons', redirectTo: 'billing/addons' },
  { path: 'admin/subscription/usage', redirectTo: 'billing/usage' },
];

export const routes: Route[] = [
  {
    path: 'home',
    loadChildren: () => import('./domains/website/routes'),
  },

  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/routes'),
  },

  {
    path: 'coming-soon',
    loadChildren: () => import('./domains/coming-soon/routes'),
  },

  ...legacyAdminRedirects,

  {
    path: '',
    loadChildren: () => import('./domains/admin/routes'),
  },
];
