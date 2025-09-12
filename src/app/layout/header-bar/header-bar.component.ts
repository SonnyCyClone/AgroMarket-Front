/**
 * Componente de barra de navegación superior para AgroMarket
 * 
 * @description Componente que renderiza la barra de navegación principal de la aplicación,
 * incluyendo logo, barra de búsqueda, botones de acción y menú de usuario con dropdown.
 * Maneja el estado de autenticación y proporciona navegación hacia diferentes secciones.
 * Actualizado con logo desde Azure Blob Storage, posicionamiento sticky y Material Design.
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../core/models/auth.model';

/**
 * Componente standalone para la barra de navegación superior
 */
@Component({
  selector: 'app-header-bar',
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css'
})
export class HeaderBarComponent implements OnDestroy {
  /** Controla la visibilidad del dropdown de usuario */
  showUserDropdown = false;
  
  /** Controla la visibilidad del dropdown de administración */
  showAdminDropdown = false;
  
  /** Información del usuario actualmente autenticado */
  currentUser: User | null = null;
  
  /** URL del logo principal - usando Blob URL específico */
  logoUrl = 'https://azstaagromarket.blob.core.windows.net/productos?sp=r&st=2025-09-12T22:25:12Z&se=2025-12-31T06:40:12Z&spr=https&sv=2024-11-04&sr=c&sig=9Z8yTQYXsBePoAs50WcOMBusYafTexW0nTgXVnVHfe0%3D';
  
  /** Suscripción al observable del usuario actual */
  private userSubscription: Subscription;

  /**
   * Constructor del componente header
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * Limpia las suscripciones al destruir el componente
   */
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * Verifica si el usuario puede gestionar productos
   */
  get canManageProducts(): boolean {
    return this.authService.canManageProducts();
  }

  /**
   * Obtiene el nombre completo del usuario actual
   */
  get userDisplayName(): string {
    const nombre = this.authService.getUserNombre();
    const apellido = this.authService.getUserApellido();
    
    if (nombre && apellido) {
      return `${nombre} ${apellido}`;
    } else if (nombre) {
      return nombre;
    }
    
    return 'Usuario';
  }

  /**
   * Maneja clics en el documento para cerrar los dropdowns
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Cerrar dropdown de usuario si se hace click fuera
    if (!target.closest('.user-dropdown-container')) {
      this.showUserDropdown = false;
    }
    
    // Cerrar dropdown de administración si se hace click fuera
    if (!target.closest('.admin-dropdown-container')) {
      this.showAdminDropdown = false;
    }
  }

  /**
   * Maneja el clic en el logo para navegar al inicio
   */
  onLogoClick(): void {
    this.router.navigate(['/']);
  }

  /**
   * Alterna la visibilidad del dropdown de usuario
   */
  onUserDropdownToggle(event: Event): void {
    event.stopPropagation();
    this.showUserDropdown = !this.showUserDropdown;
  }

  /**
   * Alterna la visibilidad del dropdown de administración
   */
  onAdminDropdownToggle(event: Event): void {
    event.stopPropagation();
    this.showAdminDropdown = !this.showAdminDropdown;
    // Cerrar el dropdown de usuario si está abierto
    this.showUserDropdown = false;
  }

  /**
   * Navega a la página de login
   */
  onLoginClick(): void {
    this.showUserDropdown = false;
    this.router.navigate(['/login']);
  }

  /**
   * Navega a la página de registro de usuario
   */
  onRegisterClick(): void {
    this.showUserDropdown = false;
    this.router.navigate(['/register-user']);
  }

  /**
   * Cierra la sesión del usuario
   */
  onLogout(): void {
    this.showUserDropdown = false;
    this.authService.logout();
  }

  /**
   * Navega a la página de registro de productos
   */
  onRegisterProductClick(): void {
    this.showAdminDropdown = false;
    this.router.navigate(['/products/new']);
  }

  /**
   * Navega a la página de gestión/actualización de productos
   */
  onManageProductsClick(): void {
    this.showAdminDropdown = false;
    this.router.navigate(['/products/manage']);
  }

  /**
   * Maneja el error de carga del logo del header
   */
  onHeaderLogoError(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    
    // Si falla la URL de Blob, usar placeholder local
    if (img.src.includes('azstaagromarket.blob.core.windows.net')) {
      img.src = 'assets/icon/placeholder.svg';
    }
  }
}
