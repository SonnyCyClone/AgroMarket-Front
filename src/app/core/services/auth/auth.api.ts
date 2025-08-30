/**
 * Servicio API para autenticación en AgroMarket
 * 
 * @description Servicio responsable de realizar las llamadas HTTP relacionadas
 * con la autenticación de usuarios contra el API real.
 * 
 * Endpoints utilizados:
 * - POST /api/Usuario/login: Autenticación de usuario
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, LoginResponse } from '../../models/auth.model';

/**
 * Servicio para realizar autenticación contra el API real
 * 
 * @description Proporciona métodos para autenticar usuarios utilizando
 * el endpoint real del backend. Maneja tanto login real como métodos
 * legacy para compatibilidad.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private httpService: HttpService) {}

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
    return this.httpService.post<LoginResponse>('/api/Usuario/login', body);
  }

  // Legacy methods for compatibility
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>('/api/auth/login', credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>('/api/auth/register', userData);
  }

  refreshToken(): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>('/api/auth/refresh', {});
  }

  logout(): Observable<void> {
    return this.httpService.post<void>('/api/auth/logout', {});
  }
}
