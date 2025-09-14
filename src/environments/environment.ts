/**
 * Configuración de entornos para AgroMarket Frontend
 * Soporta URLs separadas para dominios de Producto y Autenticación
 * con capacidad de override mediante localStorage
 */
export const environment = {
  production: false,
  
  /** URL base para servicios de productos (catálogo, registro, etc.) */
  apiBaseUrlProduct: 'https://az-agromarket-back-product.azurewebsites.net',
  
  /** URL base para servicios de autenticación (login, registro usuarios, etc.) */
  apiBaseUrlAuth: 'https://az-agromarket-back-auth.azurewebsites.net',
  
  /** 
   * Obtiene la URL base para servicios de productos
   * Verifica localStorage por overrides de desarrollo
   */
  getProductApiUrl(): string {
    return localStorage.getItem('overrideProductUrl') || this.apiBaseUrlProduct;
  },
  
  /** 
   * Obtiene la URL base para servicios de autenticación
   * Verifica localStorage por overrides de desarrollo
   */
  getAuthApiUrl(): string {
    return localStorage.getItem('overrideAuthUrl') || this.apiBaseUrlAuth;
  }
};
