/**
 * Modelos para la creación de usuarios en AgroMarket
 * 
 * @description Define las interfaces de TypeScript para el manejo de datos
 * relacionados con el registro de nuevos usuarios, incluyendo las estructuras
 * de petición y respuesta del endpoint de creación de usuarios.
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

/**
 * Estructura de datos requerida para crear un nuevo usuario
 * 
 * @description Interface que define los campos obligatorios para el registro
 * de un nuevo usuario en el sistema. Todos los campos son requeridos
 * según la especificación de la API.
 * 
 * @interface CrearUsuarioRequest
 */
export interface CrearUsuarioRequest {
  /** Dirección de correo electrónico del usuario (debe ser válida) */
  Email: string;
  
  /** Nombre del usuario */
  Nombre: string;
  
  /** Apellido del usuario */
  Apellido: string;
  
  /** Número de teléfono de contacto */
  Telefono: string;
  
  /** Dirección física del usuario */
  Direccion: string;
  
  /** Número de documento de identificación */
  Documento: string;
  
  /** Contraseña para acceder al sistema */
  Password: string;
}

/**
 * Respuesta del servidor al crear un usuario exitosamente
 * 
 * @description Interface que define la estructura de datos que retorna
 * el servidor cuando se crea un usuario correctamente. Todos los campos
 * son opcionales ya que pueden variar según la implementación del backend.
 * 
 * @interface CrearUsuarioResponse
 */
export interface CrearUsuarioResponse {
  /** Correo electrónico del usuario creado */
  email?: string;
  
  /** Nombre de usuario asignado */
  username?: string;
  
  /** Nombre del usuario */
  nombre?: string;
  
  /** Apellido del usuario */
  apellido?: string;
  
  /** ID único del usuario en el sistema */
  id?: number;
  
  /** Fecha de creación del usuario */
  fechaCreacion?: string;
  
  /** Estado del usuario (activo, inactivo, etc.) */
  estado?: string;
}
