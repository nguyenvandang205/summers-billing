import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/help-center-home.component'),
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/help-center-faq.component'),
  },
  {
    path: 'support',
    loadComponent: () => import('./features/help-center-support.component'),
  },
  {
    path: 'guides',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'getting-started',
      },
      {
        path: ':id',
        loadComponent: () => import('./features/help-center-guide.component'),
      },
    ],
  },
];

export default routes;
