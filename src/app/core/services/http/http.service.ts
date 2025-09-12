/**
 * Servicio HTTP centralizado para AgroMarket
 * 
 * @description Servicio que encapsula todas las operaciones HTTP de la aplicación,
 * proporcionando una capa de abstracción sobre HttpClient con configuración
 * automática de headers, manejo de URL base y soporte para override runtime.
 * 
 * Características:
 * - URL base configurable via environment.apiBaseUrl
 * - Override runtime via localStorage['agromarket_apiBaseUrl']
 * - Headers automáticos para JSON y FormData
 * - Preparado para autenticación futura con tokens Bearer
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

/**
 * Servicio para realizar peticiones HTTP con configuración centralizada
 * 
 * @description Proporciona métodos para operaciones CRUD (GET, POST, PUT, DELETE)
 * con configuración automática de headers y URL base. Soporta tanto JSON como
 * FormData según el tipo de petición requerida.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  /** URL base para todas las peticiones HTTP */
  private baseUrl: string;

  /**
   * Constructor del servicio HTTP
   * 
   * @description Inicializa el servicio configurando la URL base. Primero verifica
   * si existe un override en localStorage, luego usa el valor del environment.
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private http: HttpClient) {
    // Verificar override en localStorage primero, luego usar environment (default a productos)
    this.baseUrl = localStorage.getItem('agromarket_apiBaseUrl') || environment.getProductApiUrl();
  }

  /**
   * Genera headers estándar para peticiones JSON
   * 
   * @description Crea los headers necesarios para peticiones que envían JSON.
   * Incluye Content-Type y está preparado para agregar Authorization en el futuro.
   * 
   * @returns {HttpHeaders} Headers configurados para JSON
   * @private
   */
  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Futuro: Agregar header de Authorization aquí cuando sea necesario
    // const token = localStorage.getItem('agromarket_token');
    // if (token) {
    //   headers = headers.set('Authorization', `Bearer ${token}`);
    // }
    
    return headers;
  }

  /**
   * Genera headers para peticiones con FormData
   * 
   * @description Crea headers para peticiones que envían FormData. No establece
   * Content-Type para permitir que el navegador configure el boundary automáticamente.
   * 
   * @returns {HttpHeaders} Headers configurados para FormData
   * @private
   */
  private getFormDataHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    
    // No establecer Content-Type para FormData - dejar que el navegador lo configure con boundary
    // Futuro: Agregar header de Authorization aquí cuando sea necesario
    // const token = localStorage.getItem('agromarket_token');
    // if (token) {
    //   headers = headers.set('Authorization', `Bearer ${token}`);
    // }
    
    return headers;
  }

  /**
   * Realiza una petición HTTP GET
   * 
   * @description Envía una petición GET al endpoint especificado con headers JSON.
   * La URL completa se forma concatenando baseUrl + endpoint.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/usuarios')
   * @returns {Observable<T>} Observable con la respuesta tipada
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Realiza una petición HTTP POST con JSON
   * 
   * @description Envía una petición POST al endpoint especificado con el cuerpo
   * en formato JSON y headers apropiados.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/usuarios')
   * @param {any} body - Datos a enviar en el cuerpo de la petición
   * @returns {Observable<T>} Observable con la respuesta tipada
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  /**
   * Realiza una petición HTTP POST con FormData
   * 
   * @description Envía una petición POST al endpoint especificado con FormData
   * en el cuerpo. Útil para subir archivos o enviar datos multipart.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/productos')
   * @param {FormData} formData - Datos FormData a enviar
   * @returns {Observable<T>} Observable con la respuesta tipada
   */
  postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, {
      headers: this.getFormDataHeaders()
    });
  }

  /**
   * Realiza una petición HTTP PUT
   * 
   * @description Envía una petición PUT al endpoint especificado para actualizar
   * un recurso existente con los datos proporcionados.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/usuarios/123')
   * @param {any} body - Datos actualizados a enviar
   * @returns {Observable<T>} Observable con la respuesta tipada
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  /**
   * Realiza una petición HTTP DELETE
   * 
   * @description Envía una petición DELETE al endpoint especificado para
   * eliminar un recurso del servidor.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/usuarios/123')
   * @returns {Observable<T>} Observable con la respuesta tipada
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Actualiza la URL base del servicio
   * 
   * @description Cambia la URL base para todas las futuras peticiones HTTP
   * y persiste el cambio en localStorage para mantenerlo entre sesiones.
   * 
   * @param {string} newBaseUrl - Nueva URL base (ej: 'https://api.agromarket.com')
   * 
   * @example
   * ```typescript
   * // Cambiar a URL de desarrollo
   * this.httpService.updateBaseUrl('http://localhost:3000');
   * 
   * // Cambiar a URL de producción
   * this.httpService.updateBaseUrl('https://api.agromarket.com');
   * ```
   */
  updateBaseUrl(newBaseUrl: string): void {
    this.baseUrl = newBaseUrl;
    localStorage.setItem('agromarket_apiBaseUrl', newBaseUrl);
  }
}
