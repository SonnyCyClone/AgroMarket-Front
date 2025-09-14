import { Routes } from '@angular/router';

export const PROFILE_ROUTES: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./profile.page').then(c => c.ProfilePage) 
  },
  { 
    path: 'personal', 
    loadComponent: () => import('./sections/personal-info.page').then(c => c.PersonalInfoPage) 
  },
  { 
    path: 'account', 
    loadComponent: () => import('./sections/account-data.page').then(c => c.AccountDataPage) 
  },
  { 
    path: 'security', 
    loadComponent: () => import('./sections/security.page').then(c => c.SecurityPage) 
  },
  { 
    path: 'cards', 
    loadComponent: () => import('./sections/cards.page').then(c => c.CardsPage) 
  },
  { 
    path: 'addresses', 
    loadComponent: () => import('./sections/addresses.page').then(c => c.AddressesPage) 
  },
  { 
    path: 'purchases', 
    loadComponent: () => import('./sections/purchases.page').then(c => c.PurchasesPage) 
  },
];