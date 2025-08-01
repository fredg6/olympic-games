import { Routes } from '@angular/router';
import { Detail } from './pages/detail/detail';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'detail/:id', component: Detail },
  { path: '**', component: NotFound }
];
