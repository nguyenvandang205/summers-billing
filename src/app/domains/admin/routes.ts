import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/routes'),
      },
      {
        path: 'billing',
        loadChildren: () => import('./modules/billing/routes'),
      },
      {
        path: 'reports',
        loadChildren: () => import('./modules/reports/routes'),
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/extras/settings/routes'),
      },

      // Legacy redirects
      { path: 'subscription', pathMatch: 'full', redirectTo: 'billing/plan' },
      { path: 'subscription/plan', redirectTo: 'billing/plan' },
      { path: 'subscription/addons', redirectTo: 'billing/addons' },
      { path: 'subscription/usage', redirectTo: 'billing/usage' },
      { path: 'analytics', redirectTo: 'reports/spending' },
      { path: 'finance', redirectTo: 'reports/spending' },
      { path: 'organization', redirectTo: 'dashboard' },

      {
        path: '404',
        pathMatch: 'full',
        loadComponent: () =>
          import('./modules/extras/error/features/error-404.component'),
      },

      { path: '**', redirectTo: '404' },
    ],
  },
];

export default routes;
