/**
 * Modelo de tipo de producto según API backend
 * 
 * @description Interface que representa un tipo de producto
 * tal como viene del endpoint GET /api/TipoProducto según Postman collection.
 * Los campos siguen la estructura real del API.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */
export interface TipoProducto {
  /** Identificador único del tipo de producto */
  id: number;
  
  /** Nombre del tipo de producto (ej: "Verduras", "Frutas") */
  nombre: string;
  
  /** Descripción completa del tipo de producto */
  descripcion: string;
  
  /** Indica si el tipo está activo */
  activo: boolean;
}
