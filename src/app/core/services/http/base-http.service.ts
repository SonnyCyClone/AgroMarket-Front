/**
 * Servicio HTTP base para AgroMarket
 * 
 * @description Clase base abstracta que proporciona funcionalidad común para
 * servicios HTTP especializados (Productos, Autenticación). Contiene la lógica
 * compartida para headers, configuración y peticiones HTTP básicas.
 * 
 * Características:
 * - Headers automáticos para JSON y FormData
 * - Soporte para autenticación con tokens Bearer
 * - Configuración de URLs base abstracta
 * - Manejo consistente de errores HTTP
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Clase base abstracta para servicios HTTP especializados
 * 
 * @description Proporciona métodos comunes para operaciones CRUD (GET, POST, PUT, DELETE)
 * con configuración automática de headers. Las clases derivadas deben implementar
 * el método getBaseUrl() para especificar su URL base específica.
 */
@Injectable()
export abstract class BaseHttpService {
  
  /**
   * Constructor del servicio HTTP base
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones
   */
  constructor(protected http: HttpClient) {}

  /**
   * Obtiene la URL base específica para el servicio derivado
   * 
   * @description Método abstracto que debe ser implementado por las clases derivadas
   * para proporcionar su URL base específica (productos, autenticación, etc.)
   * 
   * @returns {string} URL base para las peticiones del servicio
   * @abstract
   */
  protected abstract getBaseUrl(): string;

  /**
   * Genera headers estándar para peticiones JSON
   * 
   * @description Crea los headers necesarios para peticiones que envían JSON.
   * Incluye Content-Type y Authorization si existe token en localStorage.
   * 
   * @returns {HttpHeaders} Headers configurados para JSON
   * @protected
   */
  protected getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Agregar header de Authorization si existe token
    const token = localStorage.getItem('agromarket_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  /**
   * Genera headers para peticiones con FormData
   * 
   * @description Crea headers para peticiones que envían FormData. No establece
   * Content-Type para permitir que el navegador configure el boundary automáticamente.
   * Incluye Authorization si existe token.
   * 
   * @returns {HttpHeaders} Headers configurados para FormData
   * @protected
   */
  protected getFormDataHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    
    // No establecer Content-Type para FormData - dejar que el navegador lo configure con boundary
    // Agregar header de Authorization si existe token
    const token = localStorage.getItem('agromarket_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  /**
   * Realiza una petición HTTP GET
   * 
   * @description Envía una petición GET al endpoint especificado con headers JSON.
   * La URL completa se forma concatenando baseUrl + endpoint.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/Producto')
   * @returns {Observable<T>} Observable con la respuesta tipada
   * @protected
   */
  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.getBaseUrl()}${endpoint}`, {
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
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/Usuario')
   * @param {any} body - Datos a enviar en el cuerpo de la petición
   * @returns {Observable<T>} Observable con la respuesta tipada
   * @protected
   */
  protected post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.getBaseUrl()}${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  /**
   * Realiza una petición HTTP POST con FormData
   * 
   * @description Envía una petición POST al endpoint especificado con FormData
   * en el cuerpo. Útil para subir archivos o enviar datos multipart como productos.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/Producto')
   * @param {FormData} formData - Datos FormData a enviar
   * @returns {Observable<T>} Observable con la respuesta tipada
   * @protected
   */
  protected postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.getBaseUrl()}${endpoint}`, formData, {
      headers: this.getFormDataHeaders()
    });
  }

  /**
   * Realiza una petición HTTP PUT con FormData
   * 
   * @description Envía una petición PUT al endpoint especificado con FormData
   * en el cuerpo. Útil para actualizar productos con archivos adjuntos.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/Producto')
   * @param {FormData} formData - Datos FormData a enviar
   * @returns {Observable<T>} Observable con la respuesta tipada
   * @protected
   */
  protected putFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.put<T>(`${this.getBaseUrl()}${endpoint}`, formData, {
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
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/Producto/123')
   * @param {any} body - Datos actualizados a enviar
   * @returns {Observable<T>} Observable con la respuesta tipada
   * @protected
   */
  protected put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.getBaseUrl()}${endpoint}`, body, {
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
   * @param {string} endpoint - Ruta del endpoint (ej: '/api/Producto/123')
   * @returns {Observable<T>} Observable con la respuesta tipada
   * @protected
   */
  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.getBaseUrl()}${endpoint}`, {
      headers: this.getHeaders()
    });
  }
}
