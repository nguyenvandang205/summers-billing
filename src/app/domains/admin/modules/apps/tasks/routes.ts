import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/tasks.component'),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/task.component'),
      },
    ],
  },
];

export default routes;
