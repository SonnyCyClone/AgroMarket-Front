/**
 * Modelos de productos para AgroMarket
 * 
 * @description Interfaces que definen la estructura de datos para productos
 * según la especificación del API backend. Incluye tanto el modelo base
 * como el modelo extendido con relaciones de catálogo.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

/**
 * Modelo base de producto según API backend
 * 
 * @description Interface que representa un producto tal como viene del endpoint
 * GET /api/Producto. Incluye todos los campos retornados por el servidor.
 */
export interface Product {
  /** Identificador único del producto */
  id: number;
  
  /** Variedad específica del producto (ej: "Tomate Cherry") */
  variedad: string;
  
  /** Descripción detallada del producto */
  descripcion: string;
  
  /** Precio unitario en pesos colombianos (COP) */
  precio: number;
  
  /** Cantidad disponible en inventario */
  cantidadDisponible: number;
  
  /** ID de la unidad de medida asociada */
  unidadesId: number;
  
  /** ID del tipo de producto asociado */
  idTipoProducto: number;
  
  /** URL de la imagen del producto (puede ser null) */
  imagenUrl: string | null;
  
  /** Indica si el producto está activo/disponible */
  activo: boolean;
  
  /** Fecha de creación del producto */
  fechaCreacion: string;
  
  /** Fecha de última actualización */
  fechaActualizacion: string;
}

/**
 * Modelo extendido de producto con información de catálogos
 * 
 * @description Interface que incluye información adicional de relaciones
 * como unidades, tipos de producto y categorías para mostrar en UI.
 */
export interface ProductDetailed extends Product {
  /** Información de la unidad de medida */
  unidad?: {
    id: number;
    sigla: string;
    descripcion: string;
    activo: boolean;
  };
  
  /** Información del tipo de producto */
  tipoProducto?: {
    id: number;
    sigla: string;
    descripcion: string;
    activo: boolean;
  };
  
  /** Información de categoría (si aplica) */
  categoria?: {
    id: number;
    sigla: string;
    descripcion: string;
    activo: boolean;
  };
}

/**
 * Datos para crear un nuevo producto
 * 
 * @description Interface para el payload de creación de productos
 * que se envía al endpoint POST /api/Producto como FormData.
 */
export interface CreateProductRequest {
  /** Variedad del producto */
  variedad: string;
  
  /** Descripción del producto */
  descripcion: string;
  
  /** Precio en COP */
  precio: number;
  
  /** Cantidad inicial disponible */
  cantidadDisponible: number;
  
  /** ID de la unidad de medida */
  unidadesId: number;
  
  /** ID del tipo de producto */
  idTipoProducto: number;
  
  /** Archivo de imagen (File object) */
  imagen?: File;
  
  /** Estado activo (true por defecto) */
  activo: boolean;
}

/**
 * Modelo legacy para compatibilidad (DEPRECATED)
 * 
 * @deprecated Usar Product interface para nuevas implementaciones
 */
export interface LegacyProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  discountPercent?: number;
  imageUrl: string;
  description: string;
  createdAt: string;
}
