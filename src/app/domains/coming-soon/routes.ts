import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./coming-soon-layout.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/coming-soon.component'),
      },
    ],
  },
];

export default routes;
