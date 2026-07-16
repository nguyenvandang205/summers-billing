import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth-layout.component'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in',
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/forgot-password/auth-forgot-password.component'),
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/reset-password/auth-reset-password.component'),
      },
      {
        path: 'sign-in',
        loadComponent: () => import('./features/sign-in/auth-sign-in.component'),
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./features/sign-up/auth-sign-up.component'),
      },
    ],
  },
];

export default routes;
