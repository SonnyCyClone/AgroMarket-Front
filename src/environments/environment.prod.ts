/**
 * Configuración de entornos de producción para AgroMarket Frontend
 * URLs separadas para dominios de Producto y Autenticación
 */
export const environment = {
  production: true,
  
  /** URL base para servicios de productos (catálogo, registro, etc.) */
  apiBaseUrlProduct: 'https://az-agromarket-back-product.azurewebsites.net',
  
  /** URL base para servicios de autenticación (login, registro usuarios, etc.) */
  apiBaseUrlAuth: 'https://az-agromarket-back-auth.azurewebsites.net',
  
  /** 
   * Obtiene la URL base para servicios de productos
   * En producción no permite overrides por localStorage
   */
  getProductApiUrl(): string {
    return this.apiBaseUrlProduct;
  },
  
  /** 
   * Obtiene la URL base para servicios de autenticación
   * En producción no permite overrides por localStorage
   */
  getAuthApiUrl(): string {
    return this.apiBaseUrlAuth;
  }
};
