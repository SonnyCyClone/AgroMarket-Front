import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css'
})
export class HeaderBarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onLogoClick(): void {
    this.router.navigate(['/']);
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    this.authService.logout();
  }

  onRegisterProductClick(): void {
    this.router.navigate(['/products/new']);
  }
}
