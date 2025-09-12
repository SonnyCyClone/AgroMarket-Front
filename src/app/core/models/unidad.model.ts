/**
 * Modelo de unidad de medida según API backend
 * 
 * @description Interface que representa una unidad de medida
 * tal como viene del endpoint GET /api/Uniodades según Postman collection.
 * Los campos siguen la estructura real del API.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */
export interface Unidad {
  /** Identificador único de la unidad */
  id: number;
  
  /** Nombre completo de la unidad (ej: "kilogramo", "libra") */
  nombre: string;
  
  /** Abreviatura de la unidad (ej: "kg", "lb") */
  abreviatura: string;
  
  /** Indica si la unidad está activa */
  activo: boolean;
}
