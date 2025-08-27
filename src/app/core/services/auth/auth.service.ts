/**
 * Servicio de autenticación para AgroMarket
 * 
 * @description Servicio principal que maneja toda la lógica de autenticación
 * de la aplicación, incluyendo login, logout, gestión de tokens y estado de usuario.
 * Soporta tanto autenticación real via API como modo mock para desarrollo.
 * 
 * Funcionalidades principales:
 * - Login y logout de usuarios
 * - Gestión de tokens JWT en localStorage
 * - Estado reactivo del usuario actual
 * - Modo mock para desarrollo y testing
 * - Persistencia de sesión entre recargas
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { AuthApiService } from './auth.api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../models/auth.model';

/**
 * Servicio para gestionar la autenticación de usuarios
 * 
 * @description Proporciona métodos para login, logout, registro y gestión
 * del estado de autenticación. Mantiene el estado del usuario actual
 * y maneja la persistencia de tokens en localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Clave para almacenar el token JWT en localStorage */
  private readonly tokenKey = 'agromarket_token';
  
  /** Clave para almacenar datos del usuario en localStorage */
  private readonly userKey = 'agromarket_user';
  
  /** Subject para el usuario actual (estado reactivo) */
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  /** Observable público del usuario actual */
  public currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Constructor del servicio de autenticación
   * 
   * @description Inicializa el servicio y carga los datos de usuario
   * almacenados si existe una sesión activa.
   * 
   * @param {Router} router - Router de Angular para navegación
   * @param {AuthApiService} authApiService - Servicio para llamadas de autenticación
   */
  constructor(
    private router: Router,
    private authApiService: AuthApiService
  ) {
    this.loadStoredUser();
  }

  /**
   * Carga los datos del usuario desde localStorage
   * 
   * @description Intenta recuperar y establecer los datos del usuario
   * desde localStorage si existe un token válido. Se ejecuta al inicializar
   * el servicio para mantener la sesión entre recargas.
   * 
   * @private
   */
  private loadStoredUser(): void {
    const userData = localStorage.getItem(this.userKey);
    if (userData && this.isLoggedIn()) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  /**
   * Autentica un usuario en el sistema
   * 
   * @description Envía las credenciales al servidor para autenticar al usuario.
   * Si la autenticación es exitosa, almacena el token y datos del usuario.
   * 
   * @param {LoginRequest} credentials - Credenciales de login (email y password)
   * @returns {Observable<AuthResponse>} Observable con la respuesta de autenticación
   * 
   * @example
   * ```typescript
   * this.authService.login({ email: 'user@example.com', password: 'password' })
   *   .subscribe({
   *     next: (response) => console.log('Login exitoso', response),
   *     error: (error) => console.error('Error de login', error)
   *   });
   * ```
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.authApiService.login(credentials).pipe(
      tap(response => {
        this.setAuthData(response);
      }),
      catchError(error => {
        console.error('Error de login:', error);
        throw error;
      })
    );
  }

  /**
   * Registra un nuevo usuario en el sistema
   * 
   * @description Envía los datos de registro al servidor para crear una nueva cuenta.
   * Si el registro es exitoso, autentica automáticamente al usuario.
   * 
   * @param {RegisterRequest} userData - Datos del usuario a registrar
   * @returns {Observable<AuthResponse>} Observable con la respuesta de registro
   * 
   * @deprecated Este método usa la estructura legacy. Para nuevos registros usar UserApiService.crearUsuario()
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.authApiService.register(userData).pipe(
      tap(response => {
        this.setAuthData(response);
      }),
      catchError(error => {
        console.error('Error de registro:', error);
        throw error;
      })
    );
  }

  /**
   * Autenticación mock para desarrollo y testing
   * 
   * @description Método de autenticación simulada que acepta credenciales
   * específicas o cualquier valor no vacío. Útil para desarrollo.
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {boolean} True si la autenticación mock fue exitosa
   * 
   * @deprecated Usar login(credentials) para autenticación real
   * 
   * @example
   * ```typescript
   * // Acepta cualquier valor no vacío
   * const success = this.authService.loginMock('test@test.com', '123456');
   * 
   * // O credenciales específicas
   * const success = this.authService.loginMock('admin@example.com', 'password');
   * ```
   */
  loginMock(email: string, password: string): boolean {
    // Autenticación mock: acepta cualquier valor no vacío o credenciales específicas
    if ((email && password) || (email === 'admin@example.com' && password === 'password')) {
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        usuario: {
          id: 1,
          nombre: 'Usuario Demo',
          email: email
        },
        expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      this.setAuthData(mockResponse);
      return true;
    }
    return false;
  }

  /**
   * Almacena los datos de autenticación en localStorage
   * 
   * @description Guarda el token JWT y los datos del usuario en localStorage
   * y actualiza el estado reactivo del usuario actual.
   * 
   * @param {AuthResponse} response - Respuesta de autenticación del servidor
   * @private
   */
  private setAuthData(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.usuario));
    this.currentUserSubject.next(response.usuario);
  }

  /**
   * Limpia todos los datos de autenticación
   * 
   * @description Elimina el token y datos de usuario de localStorage
   * y resetea el estado del usuario actual a null.
   * 
   * @private
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  /**
   * Verifica si el usuario está autenticado
   * 
   * @description Comprueba si existe un token válido en localStorage.
   * En futuras versiones debería validar también la expiración del token.
   * 
   * @returns {boolean} True si el usuario está autenticado, false en caso contrario
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;
    
    // TODO: Agregar verificación de expiración del token
    return true;
  }

  /**
   * Cierra la sesión del usuario actual
   * 
   * @description Notifica al servidor del logout, limpia los datos locales
   * y redirige al usuario a la página principal. Si la llamada al servidor
   * falla, aún así limpia los datos locales.
   * 
   * @returns {void}
   */
  logout(): void {
    this.authApiService.logout().subscribe({
      next: () => {
        this.clearAuthData();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error en logout:', error);
        // Limpiar datos locales aunque falle la llamada al API
        this.clearAuthData();
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * Obtiene el token JWT actual
   * 
   * @description Retorna el token de autenticación almacenado en localStorage
   * o null si no existe.
   * 
   * @returns {string | null} Token JWT o null si no está autenticado
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Obtiene la información del usuario actual
   * 
   * @description Retorna los datos del usuario actualmente autenticado
   * o null si no hay usuario logueado.
   * 
   * @returns {User | null} Datos del usuario actual o null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
