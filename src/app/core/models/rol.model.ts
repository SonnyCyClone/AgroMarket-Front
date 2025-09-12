/**
 * Modelos para la gestión de roles de usuario en AgroMarket
 * 
 * @description Define las interfaces para el manejo de roles de usuario
 * incluyendo la estructura del modelo de rol y constantes de tipos disponibles.
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

/**
 * Estructura de un rol en el sistema
 * 
 * @description Interface que define la estructura de un rol tal como
 * es devuelto por el endpoint GET /api/Rol.
 * 
 * @interface Rol
 */
export interface Rol {
  /** Identificador único del rol */
  id: string;
  
  /** Nombre del rol */
  name: string;
  
  /** Nombre normalizado del rol (uppercase) */
  normalizedName: string;
  
  /** Token de concurrencia (puede ser null) */
  concurrencyStamp: string | null;
}

/**
 * Tipos de rol disponibles en el sistema
 * 
 * @description Enum con los tipos de rol disponibles según la API.
 * Basado en la respuesta del endpoint GET /api/Rol.
 */
export enum TipoRol {
  /** Rol para productores agrícolas */
  AGRICULTOR = 'AGRICULTOR',
  
  /** Rol para compradores/usuarios finales */
  USUARIO = 'USUARIO'
}

/**
 * Array con todos los tipos de rol para uso en dropdowns
 * 
 * @description Lista de todos los tipos de rol disponibles,
 * útil para generar opciones en select/dropdown components.
 */
export const TIPOS_ROL_DISPONIBLES = [
  TipoRol.AGRICULTOR,
  TipoRol.USUARIO
] as const;
