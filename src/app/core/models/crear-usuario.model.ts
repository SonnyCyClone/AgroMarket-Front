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
 * según la especificación de la API del endpoint POST /api/Usuario.
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
  
  /** ID del tipo de documento (referencia a TipoDocumento.id) */
  TipoDocumento: number;
  
  /** Rol del usuario en el sistema (ej: "AGRICULTOR", "COMPRADOR") */
  Rol: string;
}

/**
 * Respuesta del servidor al crear un usuario exitosamente
 * 
 * @description Interface que define la estructura de datos que retorna
 * el servidor cuando se crea un usuario correctamente. Basado en el
 * sample response del endpoint POST /api/Usuario que incluye token JWT.
 * 
 * @interface CrearUsuarioResponse
 */
export interface CrearUsuarioResponse {
  /** Correo electrónico del usuario creado */
  email: string;
  
  /** Nombre de usuario asignado (generalmente igual al email) */
  username: string;
  
  /** Nombre del usuario */
  nombre: string;
  
  /** Apellido del usuario */
  apellido: string;
  
  /** Rol asignado al usuario en el sistema */
  role: string;
  
  /** Token JWT para autenticación */
  token: string;
}
