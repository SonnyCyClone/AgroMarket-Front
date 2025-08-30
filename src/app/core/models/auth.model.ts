/**
 * Modelos de datos para autenticación en AgroMarket
 * 
 * @description Define las interfaces TypeScript para el manejo de autenticación,
 * incluyendo estructuras para login, registro y gestión de usuarios. Estos modelos
 * se utilizan principalmente para el sistema de autenticación mock.
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

/**
 * Estructura de datos para solicitud de inicio de sesión
 * 
 * @description Interface utilizada para el formulario de login del sistema mock.
 * Contiene los campos básicos necesarios para autenticar un usuario.
 */
export interface LoginRequest {
  /** Dirección de correo electrónico del usuario */
  email: string;
  
  /** Contraseña del usuario */
  password: string;
}

/**
 * Estructura de datos para solicitud de registro (sistema anterior)
 * 
 * @description Interface legacy utilizada en el sistema de registro anterior.
 * Se mantiene por compatibilidad pero se recomienda usar CrearUsuarioRequest
 * para nuevos registros.
 * 
 * @deprecated Usar CrearUsuarioRequest para nuevos desarrollos
 */
export interface RegisterRequest {
  /** Nombre del usuario */
  nombre: string;
  
  /** Dirección de correo electrónico */
  email: string;
  
  /** Contraseña del usuario */
  password: string;
  
  /** Confirmación de la contraseña */
  confirmarPassword: string;
}

/**
 * Estructura de datos para respuesta de login del API real
 * 
 * @description Interface que define la estructura de respuesta del endpoint
 * POST /api/Usuario/login para el sistema de autenticación real.
 */
export interface LoginResponse {
  /** Dirección de correo electrónico del usuario */
  email: string;
  
  /** Nombre de usuario (generalmente igual al email) */
  username: string;
  
  /** Nombre del usuario */
  nombre: string;
  
  /** Apellido del usuario */
  apellido: string;
  
  /** Token JWT para autenticación */
  token: string;
}

/**
 * Respuesta del servidor para operaciones de autenticación (legacy)
 * 
 * @description Interface que define la estructura de respuesta para login
 * y otros procesos de autenticación en el sistema mock.
 * 
 * @deprecated Usar LoginResponse para autenticación real
 */
export interface AuthResponse {
  /** Token de autenticación JWT o similar */
  token: string;
  
  /** Información del usuario autenticado */
  usuario: {
    /** ID único del usuario */
    id: number;
    
    /** Nombre del usuario */
    nombre: string;
    
    /** Correo electrónico del usuario */
    email: string;
  };
  
  /** Fecha y hora de expiración del token */
  expiration: string;
}

/**
 * Representa un usuario en el sistema
 * 
 * @description Interface base para representar la información de un usuario
 * logueado en el sistema. Se utiliza para mantener el estado de sesión.
 */
export interface User {
  /** ID único del usuario en el sistema */
  id: number;
  
  /** Nombre completo o nombre de usuario */
  nombre: string;
  
  /** Dirección de correo electrónico */
  email: string;
}
