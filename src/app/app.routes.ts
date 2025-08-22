import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'products/new',
    loadComponent: () => import('./features/register-product/register-product.page').then(m => m.RegisterProductPage),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
