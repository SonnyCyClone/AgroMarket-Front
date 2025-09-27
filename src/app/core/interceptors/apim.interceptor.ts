/**
 * Interceptor para agregar headers de Azure APIM
 * 
 * @description Interceptor HTTP que agrega automáticamente los headers requeridos
 * para Azure API Management (APIM) según el método de la petición.
 * 
 * Headers agregados:
 * - GET: Ocp-Apim-Subscription-Key
 * - POST: Ocp-Apim-Subscription-Key + Content-Type: application/json (si no se especifica otro)
 * - PUT: Ocp-Apim-Subscription-Key + Content-Type apropiado (multipart/form-data para FormData)
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApimInterceptor implements HttpInterceptor {

  /**
   * Intercepta todas las peticiones HTTP para agregar headers de APIM
   * 
   * @param req - Petición HTTP original
   * @param next - Siguiente handler en la cadena
   * @returns Observable con la respuesta HTTP
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo aplicar headers APIM a peticiones hacia nuestro API
    if (!req.url.includes(environment.apiBaseUrl)) {
      return next.handle(req);
    }

    // Crear objeto con headers base de APIM
    const apimHeaders: { [key: string]: string } = {
      'Ocp-Apim-Subscription-Key': environment.apimKey
    };

    // Agregar headers específicos por método HTTP
    switch (req.method.toUpperCase()) {
      case 'GET':
        // Para GET solo necesitamos la subscription key
        break;

      case 'POST':
        // Para POST, manejar FormData vs JSON como en PUT
        if (req.body instanceof FormData) {
          // Para FormData, NO establecer Content-Type manualmente
          // El browser lo hará automáticamente con boundary
        } else if (!req.headers.has('Content-Type')) {
          // Para otros tipos de datos, usar JSON por defecto
          apimHeaders['Content-Type'] = 'application/json';
        }
        break;

      case 'PUT':
        // Para PUT, manejar FormData vs JSON
        if (req.body instanceof FormData) {
          // Para FormData, NO establecer Content-Type manualmente
          // El browser lo hará automáticamente con boundary
        } else if (!req.headers.has('Content-Type')) {
          // Para otros tipos de datos, usar JSON por defecto
          apimHeaders['Content-Type'] = 'application/json';
        }
        break;

      default:
        // Para otros métodos (DELETE, PATCH, etc.) solo subscription key
        break;
    }

    // Clonar la petición con los nuevos headers
    const modifiedReq = req.clone({
      setHeaders: apimHeaders
    });

    return next.handle(modifiedReq);
  }
}