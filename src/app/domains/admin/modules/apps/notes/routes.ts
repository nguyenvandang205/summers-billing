import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/notes.component'),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/note.component'),
      },
    ],
  },
];

export default routes;
