/**
 * Configuración de entornos de producción para AgroMarket Frontend
 * Centraliza todas las URLs de API y endpoints en un solo lugar
 */
export const environment = {
  production: true,
  
  /** 
   * Configuración centralizada de APIs
   * Todos los servicios deben usar estos endpoints
   */
  api: {
    /** URL base para servicios de productos */
    productBase: 'https://az-agromarket-back.azurewebsites.net',
    /** Endpoint base de productos */
    product: '/api/v1/Producto',
    /** Búsqueda de productos */
    productSearch: (q: string) => `/api/v1/Producto/buscar/${encodeURIComponent(q)}`,
    /** Producto por ID */
    productById: (id: number) => `/api/v1/Producto/${id}`,
    
    /** URL base para servicios de autenticación */
    authBase: 'https://az-agromarket-back.azurewebsites.net',
    /** Login de usuario */
    authLogin: '/api/v1/Auth/login',
    /** Registro de usuario */
    authRegister: '/api/v1/Auth/register',
    /** Roles disponibles */
    authRoles: '/api/v1/Auth/roles',
    /** Login legacy */
    userLogin: '/api/Usuario/login',
    /** Crear usuario */
    userCreate: '/api/Usuario',
    
    /** Categorías */
    category: '/api/v1/Categoria',
    /** Tipos de producto por categoría */
    productTypeByCategory: (categoryId: number) => `/api/v1/TipoProducto/Categoria/${categoryId}`,
    /** Unidades de medida */
    units: '/api/v1/Unidades',
    /** Tipos de documento */
    documentTypes: '/api/v1/TipoDocumento',
    
    /** Carrito */
    cart: '/api/carrito',
    cartItems: '/api/carrito/items',
    cartItem: (itemId: number) => `/api/carrito/items/${itemId}`,
    
    /** Órdenes */
    orders: '/api/ordenes',
    orderById: (id: number) => `/api/ordenes/${id}`,
    orderStatus: (id: number) => `/api/ordenes/${id}/estado`
  }
};
