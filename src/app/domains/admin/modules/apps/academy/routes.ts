import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/academy-courses.component'),
  },
  {
    path: ':id',
    loadComponent: () => import('./features/academy-course.component'),
  },
];

export default routes;
