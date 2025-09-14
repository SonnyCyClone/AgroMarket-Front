/**
 * Modelo de categoría según API backend
 * 
 * @description Interface que representa una categoría de productos
 * tal como viene del endpoint GET /api/Categoria.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */
export interface Categoria {
  /** Identificador único de la categoría */
  id: number;
  
  /** Nombre de la categoría (texto visible) */
  nombre: string;
  
  /** Sigla o código corto de la categoría */
  sigla: string;
  
  /** Descripción completa de la categoría */
  descripcion: string;
  
  /** Indica si la categoría está activa */
  activo: boolean;
}
