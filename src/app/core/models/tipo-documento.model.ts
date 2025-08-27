/**
 * Modelo de datos para tipos de documento
 * 
 * @description Define la interfaz TypeScript para representar los diferentes
 * tipos de documento disponibles en el sistema. Esta información se obtiene
 * del endpoint GET /api/TipoDocumento y se utiliza únicamente para mostrar
 * información visual al usuario (no se envía en el payload de registro).
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

/**
 * Representa un tipo de documento disponible en el sistema
 * 
 * @description Interface que define la estructura de un tipo de documento
 * tal como lo retorna la API. Se utiliza para mostrar información de referencia
 * al usuario durante el proceso de registro, pero no forma parte del payload
 * de creación de usuario.
 * 
 * @interface TipoDocumento
 */
export interface TipoDocumento {
  /** Identificador único del tipo de documento */
  id: number;
  
  /** Sigla o abreviación del tipo de documento (ej: CC, TI, CE) */
  sigla: string;
  
  /** Descripción completa del tipo de documento */
  descripcion: string;
  
  /** Código interno del sistema (opcional) */
  codigo?: string;
  
  /** Indica si el tipo de documento está activo */
  activo?: boolean;
  
  /** Orden de visualización en listas */
  orden?: number;
  
  /** Longitud mínima permitida para este tipo de documento */
  longitudMinima?: number;
  
  /** Longitud máxima permitida para este tipo de documento */
  longitudMaxima?: number;
}
