import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/contacts.component'),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/contact.component'),
      },
    ],
  },
];

export default routes;
