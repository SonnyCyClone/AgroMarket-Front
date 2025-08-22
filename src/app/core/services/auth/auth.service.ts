import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'agromarket_token';

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    // Mock authentication: accept any non-empty values or specific credentials
    if ((email && password) || (email === 'admin@example.com' && password === 'password')) {
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem(this.tokenKey, token);
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
