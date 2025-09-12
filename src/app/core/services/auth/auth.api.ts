/**
 * Servicio API para autenticación en AgroMarket
 * 
 * @description Servicio responsable de realizar las llamadas HTTP relacionadas
 * con la autenticación de usuarios contra el API real. Hereda de BaseHttpService
 * para obtener funcionalidad HTTP común y utiliza la URL base de autenticación.
 * 
 * Endpoints utilizados:
 * - POST /api/Usuario/login: Autenticación de usuario
 * - POST /api/Usuario: Creación de nuevo usuario
 * - GET /api/TipoDocumento: Obtener tipos de documento
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../http/base-http.service';
import { environment } from '../../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, LoginResponse } from '../../models/auth.model';

/**
 * Servicio para realizar autenticación contra el API real
 * 
 * @description Proporciona métodos para autenticar usuarios utilizando
 * el endpoint real del backend. Hereda de BaseHttpService para obtener
 * métodos HTTP comunes (get, post, put, delete) con configuración automática.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthApiService extends BaseHttpService {

  /**
   * Obtiene la URL base para endpoints de autenticación
   * 
   * @description Implementa el método abstracto de BaseHttpService para
   * proporcionar la URL base específica para operaciones de autenticación.
   * Utiliza el método del environment para permitir overrides de localStorage.
   * 
   * @returns {string} URL base para endpoints de autenticación
   * @protected
   */
  protected getBaseUrl(): string {
    return environment.getAuthApiUrl();
  }

  /**
   * Autentica un usuario contra el API real
   * 
   * @description Envía credenciales al endpoint POST /api/Usuario/login
   * y retorna la respuesta con token y datos del usuario.
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Observable<LoginResponse>} Observable con la respuesta de login
   * 
   * @example
   * ```typescript
   * this.authApiService.loginReal('user@example.com', 'password123')
   *   .subscribe({
   *     next: (response) => console.log('Login exitoso:', response),
   *     error: (error) => console.error('Error 401:', error)
   *   });
   * ```
   */
  loginReal(email: string, password: string): Observable<LoginResponse> {
    const body = {
      Email: email,
      Password: password
    };
    return this.post<LoginResponse>('/api/Usuario/login', body);
  }

  // Legacy methods for compatibility
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('/api/auth/login', credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('/api/auth/register', userData);
  }

  refreshToken(): Observable<AuthResponse> {
    return this.post<AuthResponse>('/api/auth/refresh', {});
  }

  logout(): Observable<void> {
    return this.post<void>('/api/auth/logout', {});
  }

  /**
   * Hace una petición GET pública a un endpoint de autenticación
   * 
   * @description Expone el método GET protegido de BaseHttpService para
   * permitir peticiones GET desde servicios externos como UserApiService.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {string} endpoint - Ruta del endpoint
   * @returns {Observable<T>} Observable con la respuesta tipada
   */
  getPublic<T>(endpoint: string): Observable<T> {
    return this.get<T>(endpoint);
  }

  /**
   * Hace una petición POST pública a un endpoint de autenticación
   * 
   * @description Expone el método POST protegido de BaseHttpService para
   * permitir peticiones POST desde servicios externos como UserApiService.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {string} endpoint - Ruta del endpoint
   * @param {any} body - Datos a enviar en el cuerpo
   * @returns {Observable<T>} Observable con la respuesta tipada
   */
  postPublic<T>(endpoint: string, body: any): Observable<T> {
    return this.post<T>(endpoint, body);
  }
}
