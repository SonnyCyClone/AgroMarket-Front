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
import { LoginRequest, RegisterRequest, AuthResponse, User, LoginResponse } from '../../models/auth.model';
import { environment } from '../../../../environments/environment';

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
  
  /** Clave para almacenar el nombre del usuario en localStorage */
  private readonly userNombreKey = 'agromarket_user_nombre';
  
  /** Clave para almacenar el apellido del usuario en localStorage */
  private readonly userApellidoKey = 'agromarket_user_apellido';
  
  /** Clave para almacenar el rol del usuario en localStorage */
  private readonly userRolKey = 'agromarket_user_rol';
  
  /** Clave para almacenar datos del usuario en localStorage (legacy) */
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
    const token = localStorage.getItem(this.tokenKey);
    const nombre = localStorage.getItem(this.userNombreKey);
    const apellido = localStorage.getItem(this.userApellidoKey);
    const rol = localStorage.getItem(this.userRolKey);
    
    if (token && nombre && apellido) {
      const user: User = {
        id: 1, // Mock ID since real API doesn't provide it
        nombre: `${nombre} ${apellido}`,
        email: '', // We don't store email separately
        rol: rol || undefined
      };
      this.currentUserSubject.next(user);
    } else {
      // Try legacy format
      const userData = localStorage.getItem(this.userKey);
      if (userData && token) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
        } catch (error) {
          this.clearAuthData();
        }
      }
    }
  }

  /**
   * Autentica un usuario contra el API real
   * 
   * @description Envía las credenciales al endpoint real de login
   * y maneja la respuesta guardando token y datos del usuario.
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Observable<any>} Observable con la respuesta de login
   * 
   * @example
   * ```typescript
   * this.authService.loginReal('user@example.com', 'password123')
   *   .subscribe({
   *     next: (response) => console.log('Login exitoso:', response),
   *     error: (error) => {
   *       if (error.status === 401) {
   *         console.log('Credenciales inválidas');
   *       }
   *     }
   *   });
   * ```
   */
  loginReal(email: string, password: string): Observable<any> {
    return this.authApiService.loginReal(email, password).pipe(
      tap((response: any) => {
        this.setRealAuthData(response);
      }),
      catchError(error => {
        console.error('Error de login real:', error);
        throw error;
      })
    );
  }

  /**
   * Autentica un usuario en el sistema
   * 
   * @description Envía las credenciales al servidor para autenticar al usuario.
   * Si la autenticación es exitosa, almacena el token y datos del usuario.
   * 
   * @param {LoginRequest} credentials - Credenciales de login (email y password)
   * @returns {Observable<any>} Observable con la respuesta de autenticación
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
  login(credentials: LoginRequest): Observable<any> {
    return this.authApiService.login(credentials).pipe(
      tap((response: any) => {
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
   * @returns {Observable<any>} Observable con la respuesta de registro
   * 
   * @deprecated Este método usa la estructura legacy. Para nuevos registros usar UserApiService.crearUsuario()
   */
  register(userData: RegisterRequest): Observable<any> {
    return this.authApiService.register(userData).pipe(
      tap((response: any) => {
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
   * Almacena los datos de autenticación real en localStorage
   * 
   * @description Guarda el token JWT y los datos del usuario (nombre, apellido y rol)
   * en localStorage y actualiza el estado reactivo del usuario actual.
   * 
   * @param {any} response - Respuesta de autenticación del API real
   * @private
   */
  private setRealAuthData(response: any): void {
    // Guardar token
    localStorage.setItem(this.tokenKey, response.token);
    
    // Guardar nombre
    localStorage.setItem(this.userNombreKey, response.nombre);
    
    // Guardar apellido
    localStorage.setItem(this.userApellidoKey, response.apellido);
    
    // Guardar rol si existe en la respuesta
    if (response.role) {
      localStorage.setItem(this.userRolKey, response.role);
    }
    
    const user: User = {
      id: 1, // Mock ID since real API doesn't provide it
      nombre: `${response.nombre} ${response.apellido}`,
      email: response.email || '',
      rol: response.role // Usar response.role aquí también
    };
    
    this.currentUserSubject.next(user);
  }

  /**
   * Almacena los datos de autenticación en localStorage (legacy)
   * 
   * @description Guarda el token JWT y los datos del usuario en localStorage
   * y actualiza el estado reactivo del usuario actual.
   * 
   * @param {any} response - Respuesta de autenticación del servidor
   * @private
   */
  private setAuthData(response: any): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.usuario || response.user));
    this.currentUserSubject.next(response.usuario || response.user);
  }

  /**
   * Limpia todos los datos de autenticación
   * 
   * @description Elimina completamente todos los datos de sesión y resetea
   * el estado de la aplicación para permitir un login fresco.
   * 
   * @private
   */
  private clearAuthData(): void {
    // Remover claves específicas de AgroMarket primero
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.userNombreKey);
    localStorage.removeItem(this.userApellidoKey);
    localStorage.removeItem(this.userRolKey);
    localStorage.removeItem('agromarket_token');
    localStorage.removeItem('agromarket_user_nombre');
    localStorage.removeItem('agromarket_user_apellido');
    localStorage.removeItem('agromarket_user_rol');
    
    // Limpiar completamente localStorage para asegurar que no queden datos
    localStorage.clear();
    
    // Resetear el estado interno
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
   * @description Notifica al servidor del logout, limpia todos los datos locales
   * completamente y redirige al usuario a la página de login para iniciar
   * una sesión completamente fresca.
   * 
   * @returns {void}
   */
  logout(): void {
    this.authApiService.logout().subscribe({
      next: () => {
        this.clearAuthData();
        this.router.navigate(['/login']);
        // Recargar la página para asegurar un estado completamente fresco
        window.location.reload();
      },
      error: (error: any) => {
        console.error('Error en logout:', error);
        // Limpiar datos locales aunque falle la llamada al API
        this.clearAuthData();
        this.router.navigate(['/login']);
        // Recargar la página para asegurar un estado completamente fresco
        window.location.reload();
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

  /**
   * Obtiene el nombre del usuario almacenado
   * 
   * @returns {string | null} Nombre del usuario o null si no existe
   */
  getUserNombre(): string | null {
    return localStorage.getItem('agromarket_user_nombre');
  }

  /**
   * Obtiene el apellido del usuario almacenado
   * 
   * @returns {string | null} Apellido del usuario o null si no existe
   */
  getUserApellido(): string | null {
    return localStorage.getItem('agromarket_user_apellido');
  }

  /**
   * Obtiene el rol del usuario almacenado
   * 
   * @returns {string | null} Rol del usuario o null si no existe
   */
  getUserRol(): string | null {
    return localStorage.getItem('agromarket_user_rol');
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * 
   * @param {string} requiredRole - Rol requerido para verificar
   * @returns {boolean} True si el usuario tiene el rol especificado
   */
  hasRole(requiredRole: string): boolean {
    const userRole = this.getUserRol();
    return userRole === requiredRole;
  }

  /**
   * Verifica si el usuario es agricultor
   * 
   * @returns {boolean} True si el usuario tiene rol de AGRICULTOR
   */
  isAgricultor(): boolean {
    const currentRole = this.hasRole('AGRICULTOR');
    console.log('isAgricultor - hasRole result:', currentRole); // DEBUG
    console.log('isAgricultor - checking role AGRICULTOR against:', localStorage.getItem(this.userRolKey)); // DEBUG
    return currentRole;
  }

  /**
   * Verifica si el usuario puede gestionar productos
   * 
   * @description Determina si el usuario tiene permisos para crear/editar productos.
   * Solo los usuarios con rol AGRICULTOR pueden gestionar productos.
   * 
   * @returns {boolean} True si el usuario puede gestionar productos
   */
  canManageProducts(): boolean {
    const isLoggedIn = this.isLoggedIn();
    const isAgricultor = this.isAgricultor();
    const currentUser = this.currentUserSubject.value;
    
    console.log('canManageProducts - isLoggedIn:', isLoggedIn); // DEBUG
    console.log('canManageProducts - isAgricultor:', isAgricultor); // DEBUG
    console.log('canManageProducts - currentUser:', currentUser); // DEBUG
    console.log('canManageProducts - localStorage rol:', localStorage.getItem(this.userRolKey)); // DEBUG
    
    return isLoggedIn && isAgricultor;
  }

  /**
   * Obtiene la configuración actual de URLs de servicios
   * 
   * @returns {object} Configuración de URLs para autenticación y productos
   */
  getServiceConfiguration() {
    return {
      authBaseUrl: environment.getAuthApiUrl(),
      productBaseUrl: environment.getProductApiUrl(),
      overrideAuthUrl: localStorage.getItem('overrideAuthUrl'),
      overrideProductUrl: localStorage.getItem('overrideProductUrl'),
      isProduction: environment.production
    };
  }

  /**
   * Establece URLs de override para desarrollo
   * 
   * @param {string | null} authUrl - URL override para autenticación
   * @param {string | null} productUrl - URL override para productos
   */
  setServiceOverrides(authUrl: string | null, productUrl: string | null) {
    if (authUrl) {
      localStorage.setItem('overrideAuthUrl', authUrl);
    } else {
      localStorage.removeItem('overrideAuthUrl');
    }

    if (productUrl) {
      localStorage.setItem('overrideProductUrl', productUrl);
    } else {
      localStorage.removeItem('overrideProductUrl');
    }
  }
}
