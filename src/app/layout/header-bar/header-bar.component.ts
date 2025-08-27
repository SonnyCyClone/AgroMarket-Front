/**
 * Componente de barra de navegación superior para AgroMarket
 * 
 * @description Componente que renderiza la barra de navegación principal de la aplicación,
 * incluyendo logo, barra de búsqueda, botones de acción y menú de usuario con dropdown.
 * Maneja el estado de autenticación y proporciona navegación hacia diferentes secciones.
 * 
 * Funcionalidades principales:
 * - Logo clickeable que navega al inicio
 * - Barra de búsqueda integrada
 * - Botón de carrito de compras
 * - Dropdown de usuario con opciones de login/registro
 * - Menú de usuario autenticado con logout
 * - Botón "Registrar Producto" para usuarios logueados
 * - Cierre automático de dropdown al hacer clic fuera
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
 * 
 * @description Maneja la navegación principal, estado de autenticación
 * y dropdown de opciones de usuario. Se suscribe al estado de usuario
 * para mostrar información personalizada.
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
  
  /** Información del usuario actualmente autenticado */
  currentUser: User | null = null;
  
  /** Suscripción al observable del usuario actual */
  private userSubscription: Subscription;

  /**
   * Constructor del componente header
   * 
   * @description Inicializa el componente y se suscribe al estado del usuario
   * para mantener actualizada la información de autenticación.
   * 
   * @param {AuthService} authService - Servicio de autenticación
   * @param {Router} router - Router de Angular para navegación
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
   * 
   * @description Se ejecuta cuando el componente se destruye para evitar
   * memory leaks cancelando la suscripción al observable de usuario.
   */
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * 
   * @description Getter que consulta el servicio de autenticación para
   * determinar si existe una sesión activa.
   * 
   * @returns {boolean} True si el usuario está logueado, false en caso contrario
   */
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * Maneja clics en el documento para cerrar el dropdown
   * 
   * @description Listener global que cierra el dropdown de usuario cuando
   * se hace clic fuera del contenedor del dropdown.
   * 
   * @param {Event} event - Evento de click del documento
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown-container')) {
      this.showUserDropdown = false;
    }
  }

  /**
   * Maneja el clic en el logo para navegar al inicio
   * 
   * @description Navega a la página principal cuando el usuario
   * hace clic en el logo de AgroMarket.
   */
  onLogoClick(): void {
    this.router.navigate(['/']);
  }

  /**
   * Alterna la visibilidad del dropdown de usuario
   * 
   * @description Abre o cierra el dropdown de opciones de usuario
   * y previene la propagación del evento para evitar que se cierre inmediatamente.
   * 
   * @param {Event} event - Evento de click del botón de usuario
   */
  onUserDropdownToggle(event: Event): void {
    event.stopPropagation();
    this.showUserDropdown = !this.showUserDropdown;
  }

  /**
   * Navega a la página de login
   * 
   * @description Cierra el dropdown y redirige al usuario a la página
   * de inicio de sesión.
   */
  onLoginClick(): void {
    this.showUserDropdown = false;
    this.router.navigate(['/login']);
  }

  /**
   * Navega a la página de registro de usuario
   * 
   * @description Cierra el dropdown y redirige al usuario a la página
   * de creación de cuenta nueva.
   */
  onRegisterClick(): void {
    this.showUserDropdown = false;
    this.router.navigate(['/register']);
  }

  /**
   * Cierra la sesión del usuario
   * 
   * @description Cierra el dropdown y ejecuta el logout a través del
   * servicio de autenticación, que limpiará los datos y redirigirá.
   */
  onLogout(): void {
    this.showUserDropdown = false;
    this.authService.logout();
  }

  /**
   * Navega a la página de registro de productos
   * 
   * @description Redirige a la página de registro de productos.
   * Este botón solo está visible para usuarios autenticados.
   */
  onRegisterProductClick(): void {
    this.router.navigate(['/products/new']);
  }
}
