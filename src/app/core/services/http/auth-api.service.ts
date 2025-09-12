/**
 * Servicio HTTP para operaciones de Autenticación en AgroMarket
 * 
 * @description Servicio especializado para manejar todas las operaciones relacionadas
 * con autenticación y gestión de usuarios: login, registro, roles y tipos de documento.
 * Conecta con el dominio de autenticación según la colección Postman.
 * 
 * Endpoints soportados:
 * - POST /api/Usuario/login - Autenticar usuario
 * - POST /api/Usuario - Registrar nuevo usuario
 * - GET /api/Usuario/roles - Obtener roles disponibles
 * - GET /api/TipoDocumento - Obtener tipos de documento
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { environment } from '../../../../environments/environment';

/**
 * Servicio para operaciones HTTP del dominio de Autenticación
 * 
 * @description Extiende BaseHttpService para proporcionar métodos específicos
 * para operaciones de autenticación. Utiliza la URL base de auth configurada
 * en environment y soporta overrides por localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthApiService extends BaseHttpService {
  
  /**
   * Constructor del servicio de API de autenticación
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular
   */
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Obtiene la URL base para servicios de autenticación
   * 
   * @description Implementa el método abstracto de BaseHttpService.
   * Utiliza environment.getAuthApiUrl() que verifica overrides en localStorage.
   * 
   * @returns {string} URL base para peticiones de autenticación
   * @protected
   */
  protected getBaseUrl(): string {
    return environment.getAuthApiUrl();
  }

  /**
   * Autentica un usuario en el sistema
   * 
   * @description Realiza POST /api/Usuario/login con credenciales del usuario.
   * Envía JSON con email y password, recibe token y datos del usuario.
   * 
   * @template T - Tipo de dato esperado en la respuesta (típicamente LoginResponse)
   * @param {any} credentials - Credenciales del usuario (email, password)
   * @returns {Observable<T>} Observable con la respuesta de autenticación
   * 
   * @example
   * ```typescript
   * const loginData = {
   *   email: 'usuario@email.com',
   *   password: 'password123'
   * };
   * 
   * this.authApi.login<LoginResponse>(loginData).subscribe(response => {
   *   localStorage.setItem('agromarket_token', response.token);
   *   localStorage.setItem('agromarket_user', JSON.stringify(response.user));
   *   console.log('Usuario autenticado:', response);
   * });
   * ```
   */
  login<T>(credentials: any): Observable<T> {
    return this.post<T>('/api/Usuario/login', credentials);
  }

  /**
   * Autentica un usuario con el endpoint real actual
   * 
   * @description Método específico para el endpoint real que espera Email y Password
   * con mayúsculas iniciales según la especificación del backend.
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Observable<any>} Observable con la respuesta de login real
   */
  loginReal(email: string, password: string): Observable<any> {
    const body = {
      Email: email,
      Password: password
    };
    return this.post<any>('/api/Usuario/login', body);
  }

  /**
   * Cierra la sesión del usuario actual
   * 
   * @description Realiza logout del usuario. Actualmente es un método local
   * ya que el API no tiene endpoint específico de logout.
   * 
   * @returns {Observable<void>} Observable que completa cuando el logout es exitoso
   */
  logout(): Observable<void> {
    // El API actual no tiene endpoint de logout, así que retornamos un observable que completa inmediatamente
    return of(undefined);
  }

  /**
   * Registra un nuevo usuario en el sistema
   * 
   * @description Realiza POST /api/Usuario con datos del nuevo usuario.
   * Según la colección Postman, envía JSON con información completa del usuario.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {any} userData - Datos del usuario a registrar
   * @returns {Observable<T>} Observable con la respuesta del registro
   * 
   * @example
   * ```typescript
   * const newUser = {
   *   nombre: 'Juan',
   *   apellido: 'Pérez',
   *   email: 'juan@email.com',
   *   password: 'password123',
   *   tipoDocumentoId: 1,
   *   numeroDocumento: '12345678',
   *   telefono: '3001234567',
   *   direccion: 'Calle 123 #45-67'
   * };
   * 
   * this.authApi.register<RegisterResponse>(newUser).subscribe(response => {
   *   console.log('Usuario registrado:', response);
   * });
   * ```
   */
  register<T>(userData: any): Observable<T> {
    return this.post<T>('/api/Usuario', userData);
  }

  /**
   * Obtiene los roles disponibles en el sistema
   * 
   * @description Realiza GET /api/Usuario/roles para obtener todos los roles.
   * Útil para poblar dropdowns de selección de roles en formularios.
   * 
   * @template T - Tipo de dato esperado (típicamente Role[])
   * @returns {Observable<T>} Observable con el array de roles
   * 
   * @example
   * ```typescript
   * this.authApi.getRoles<Role[]>().subscribe(roles => {
   *   this.roleOptions = roles.map(role => ({
   *     value: role.id,
   *     label: role.nombre
   *   }));
   * });
   * ```
   */
  getRoles<T>(): Observable<T> {
    return this.get<T>('/api/Usuario/roles');
  }

  /**
   * Obtiene los tipos de documento disponibles
   * 
   * @description Realiza GET /api/TipoDocumento para obtener tipos de documento.
   * Usado en formularios de registro para seleccionar tipo de identificación.
   * 
   * @template T - Tipo de dato esperado (típicamente TipoDocumento[])
   * @returns {Observable<T>} Observable con el array de tipos de documento
   * 
   * @example
   * ```typescript
   * this.authApi.getDocumentTypes<TipoDocumento[]>().subscribe(types => {
   *   const activeTypes = types.filter(t => t.activo);
   *   this.documentTypeOptions = activeTypes.map(t => ({
   *     value: t.id,
   *     label: `${t.sigla} - ${t.descripcion}`
   *   }));
   * });
   * ```
   */
  getDocumentTypes<T>(): Observable<T> {
    return this.get<T>('/api/TipoDocumento');
  }
}
