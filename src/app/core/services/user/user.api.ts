/**
 * Servicio API para la gestión de usuarios en AgroMarket
 * 
 * @description Servicio responsable de realizar las llamadas HTTP relacionadas
 * con la gestión de usuarios, incluyendo el registro de nuevos usuarios y la
 * obtención de tipos de documento disponibles en el sistema.
 * 
 * Endpoints consumidos:
 * - POST /api/CrearUsuario: Crea un nuevo usuario en el sistema
 * - GET /api/TipoDocumento: Obtiene la lista de tipos de documento (solo visual)
 * 
 * Consideraciones importantes:
 * - La lista de tipos de documento es únicamente informativa y no se envía en el POST
 * - Se utiliza el HttpService para manejar la URL base y configuraciones HTTP
 * - Todas las respuestas se manejan como Observable para programación reactiva
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthApiService } from '../auth/auth.api';
import { CrearUsuarioRequest, CrearUsuarioResponse } from '../../models/crear-usuario.model';
import { TipoDocumento } from '../../models/tipo-documento.model';

/**
 * Servicio para interactuar con endpoints relacionados con usuarios
 * 
 * @description Proporciona métodos para crear usuarios y obtener información
 * de tipos de documento. Utiliza el HttpService interno para manejar las
 * peticiones HTTP y la configuración de URL base.
 */
@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly authApiService = inject(AuthApiService);

  /**
   * Crea un nuevo usuario en el sistema
   * 
   * @description Envía una petición POST al endpoint /api/CrearUsuario con los
   * datos del nuevo usuario. La petición se envía como JSON en el cuerpo.
   * 
   * @param {CrearUsuarioRequest} userData - Datos del usuario a crear
   * @returns {Observable<CrearUsuarioResponse>} Observable con la respuesta del servidor
   * 
   * @example
   * ```typescript
   * const nuevoUsuario = {
   *   Email: 'usuario@example.com',
   *   Nombre: 'Juan',
   *   Apellido: 'Pérez',
   *   Telefono: '3001234567',
   *   Direccion: 'Calle 123',
   *   Documento: '12345678',
   *   Password: 'MiPassword123'
   * };
   * 
   * this.userApiService.crearUsuario(nuevoUsuario).subscribe({
   *   next: (response) => console.log('Usuario creado:', response),
   *   error: (error) => console.error('Error:', error)
   * });
   * ```
   */
  crearUsuario(userData: CrearUsuarioRequest): Observable<CrearUsuarioResponse> {
    return this.authApiService.postPublic<CrearUsuarioResponse>('/api/Usuario', userData);
  }

  /**
   * Obtiene la lista de tipos de documento disponibles
   * 
   * @description Realiza una petición GET al endpoint /api/TipoDocumento para
   * obtener todos los tipos de documento disponibles en el sistema. Esta información
   * es únicamente para mostrar al usuario como referencia y no se incluye en el
   * payload de creación de usuarios.
   * 
   * @returns {Observable<TipoDocumento[]>} Observable con el array de tipos de documento
   * 
   * @example
   * ```typescript
   * this.userApiService.listarTiposDocumento().subscribe({
   *   next: (tipos) => {
   *     tipos.forEach(tipo => {
   *       console.log(`${tipo.sigla} - ${tipo.descripcion}`);
   *     });
   *   },
   *   error: (error) => console.error('Error al cargar tipos:', error)
   * });
   * ```
   */
  listarTiposDocumento(): Observable<TipoDocumento[]> {
    return this.authApiService.getPublic<TipoDocumento[]>('/api/TipoDocumento');
  }

  /**
   * Obtiene la lista de roles disponibles en el sistema
   * 
   * @description Realiza una petición GET al endpoint /api/Usuario/roles para
   * obtener todos los roles disponibles. Útil para poblar dropdowns de selección
   * de roles en formularios de registro.
   * 
   * @returns {Observable<any[]>} Observable con el array de roles
   * 
   * @example
   * ```typescript
   * this.userApiService.listarRoles().subscribe({
   *   next: (roles) => {
   *     roles.forEach(rol => {
   *       console.log(`${rol.id} - ${rol.name}`);
   *     });
   *   },
   *   error: (error) => console.error('Error al cargar roles:', error)
   * });
   * ```
   */
  listarRoles(): Observable<any[]> {
    return this.authApiService.getPublic<any[]>('/api/Usuario/roles');
  }
}
