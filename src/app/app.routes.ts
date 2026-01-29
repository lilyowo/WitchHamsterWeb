import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LiuRen } from './pages/liu-ren/liu-ren';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'liu-ren', component: LiuRen }
];
