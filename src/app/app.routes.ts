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
    loadComponent: () => import('./features/product-edit/product-edit.page').then(m => m.ProductEditPage),
    canActivate: [agricultorGuard]
  },
  {
    path: 'products/manage',
    loadComponent: () => import('./features/products-manage/products-manage.page').then(m => m.ProductsManagePage),
    canActivate: [agricultorGuard]
  },
  {
    path: 'checkout',
    redirectTo: 'checkout/shipping',
    pathMatch: 'full'
  },
  {
    path: 'checkout/shipping',
    loadComponent: () => import('./features/checkout/checkout-shipping/checkout-shipping.page').then(m => m.CheckoutShippingPage)
  },
  {
    path: 'checkout/summary',
    loadComponent: () => import('./features/checkout/checkout-summary/checkout-summary.page').then(m => m.CheckoutSummaryPage)
  },
  {
    path: 'checkout/payment',
    loadComponent: () => import('./features/checkout/checkout-payment/checkout-payment.page').then(m => m.CheckoutPaymentPage)
  },
  {
    path: 'checkout/success',
    loadComponent: () => import('./features/checkout/checkout-success/checkout-success.page').then(m => m.CheckoutSuccessPage)
  },
  {
    path: 'checkout/failure',
    loadComponent: () => import('./features/checkout/checkout-failure/checkout-failure.page').then(m => m.CheckoutFailurePage)
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/faq/faq.page').then(m => m.FaqPage)
  },
  {
    path: 'support',
    loadComponent: () => import('./features/support/support.page').then(m => m.SupportPage)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
