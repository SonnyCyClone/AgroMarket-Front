import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard';
import { agricultorGuard } from './core/guards/auth/agricultor.guard';

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
    path: 'register-user',
    loadComponent: () => import('./features/register-user/register-user.page').then(m => m.RegisterUserPage)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.page').then(m => m.CartPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/account/forgot-password.page').then(m => m.ForgotPasswordPage)
  },
  {
    path: 'products/new',
    loadComponent: () => import('./features/register-product/register-product.page').then(m => m.RegisterProductPage),
    canActivate: [agricultorGuard]
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./features/register-product/register-product.page').then(m => m.RegisterProductPage),
    canActivate: [agricultorGuard]
  },
  {
    path: 'products/manage',
    loadComponent: () => import('./features/products-manage/products-manage.page').then(m => m.ProductsManagePage),
    canActivate: [agricultorGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
