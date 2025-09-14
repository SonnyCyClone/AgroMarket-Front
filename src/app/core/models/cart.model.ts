/**
 * Modelos para el carrito de compras - AgroMarket
 * 
 * @description Interfaces y tipos para el manejo del carrito de compras,
 * incluyendo items del carrito, estados, y funcionalidades de checkout.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Product, LegacyProduct } from './product.model';

/**
 * Monedas soportadas en el sistema
 */
export type Currency = 'COP' | 'USD' | 'EUR';

/**
 * Item individual del carrito
 * 
 * @description Representa un producto específico agregado al carrito
 * con su cantidad y metadatos adicionales.
 */
export interface CartItem {
  /** ID único del item en el carrito */
  id: string;
  
  /** Producto asociado (formato API o legacy) */
  product: Product | LegacyProduct;
  
  /** Cantidad de unidades en el carrito */
  quantity: number;
  
  /** Precio unitario al momento de agregar al carrito */
  unitPrice: number;
  
  /** Precio total para este item (unitPrice * quantity) */
  totalPrice: number;
  
  /** Moneda del precio */
  currency: Currency;
  
  /** Fecha y hora cuando se agregó al carrito */
  addedAt: Date;
  
  /** Fecha y hora de última actualización */
  updatedAt: Date;
}

/**
 * Estado del carrito de compras
 * 
 * @description Representa el estado completo del carrito incluyendo
 * items, totales calculados y metadatos.
 */
export interface CartState {
  /** Array de items en el carrito */
  items: CartItem[];
  
  /** Número total de items (suma de quantities) */
  totalItems: number;
  
  /** Precio subtotal (suma de totalPrice de todos los items) */
  subtotal: number;
  
  /** Impuestos calculados */
  taxes: number;
  
  /** Costo de envío */
  shipping: number;
  
  /** Total final (subtotal + taxes + shipping) */
  total: number;
  
  /** Moneda principal del carrito */
  currency: Currency;
  
  /** Indica si el carrito está siendo modificado */
  isUpdating: boolean;
  
  /** Fecha de creación del carrito */
  createdAt: Date;
  
  /** Fecha de última modificación */
  updatedAt: Date;
}

/**
 * Resumen de totales del carrito
 * 
 * @description Información resumida de costos y totales
 * para mostrar en UI de checkout.
 */
export interface CartSummary {
  /** Subtotal sin impuestos ni envío */
  subtotal: number;
  
  /** Impuestos calculados */
  taxes: number;
  
  /** Costo de envío */
  shipping: number;
  
  /** Descuentos aplicados */
  discounts: number;
  
  /** Total final */
  total: number;
  
  /** Moneda */
  currency: Currency;
  
  /** Número total de items únicos */
  itemCount: number;
  
  /** Número total de unidades */
  totalUnits: number;
}

/**
 * Configuración de impuestos y envío
 * 
 * @description Configuración para cálculos automáticos
 * de impuestos y costos de envío.
 */
export interface CartConfig {
  /** Porcentaje de impuestos (IVA, etc.) */
  taxRate: number;
  
  /** Costo base de envío */
  baseShippingCost: number;
  
  /** Umbral para envío gratis */
  freeShippingThreshold: number;
  
  /** Moneda por defecto */
  defaultCurrency: Currency;
  
  /** Máximo número de items por producto */
  maxQuantityPerItem: number;
  
  /** Máximo número total de items en carrito */
  maxTotalItems: number;
}

/**
 * Evento de actualización del carrito
 * 
 * @description Información sobre cambios realizados en el carrito
 * para notificaciones y tracking.
 */
export interface CartUpdateEvent {
  /** Tipo de acción realizada */
  action: 'add' | 'remove' | 'update' | 'clear';
  
  /** Item afectado (opcional para 'clear') */
  item?: CartItem;
  
  /** Cantidad anterior (para 'update') */
  previousQuantity?: number;
  
  /** Estado del carrito después del cambio */
  cartState: CartState;
  
  /** Timestamp del evento */
  timestamp: Date;
}

/**
 * Opciones para agregar items al carrito
 * 
 * @description Configuración adicional al agregar productos.
 */
export interface AddToCartOptions {
  /** Cantidad a agregar (default: 1) */
  quantity?: number;
  
  /** Forzar reemplazo si el item ya existe */
  replace?: boolean;
  
  /** Moneda específica para este item */
  currency?: Currency;
  
  /** Precio específico (útil para ofertas) */
  customPrice?: number;
}

/**
 * Resultado de operación en el carrito
 * 
 * @description Respuesta estándar para operaciones de carrito.
 */
export interface CartOperationResult {
  /** Indica si la operación fue exitosa */
  success: boolean;
  
  /** Mensaje descriptivo del resultado */
  message: string;
  
  /** Item afectado por la operación */
  item?: CartItem;
  
  /** Estado actualizado del carrito */
  cartState: CartState;
  
  /** Código de error si aplica */
  errorCode?: string;
}

/**
 * Persistencia del carrito en localStorage
 * 
 * @description Estructura para serializar/deserializar el carrito.
 */
export interface CartStorageData {
  /** Items del carrito serializados */
  items: any[];
  
  /** Configuración del carrito */
  config: CartConfig;
  
  /** Metadatos adicionales */
  metadata: {
    version: string;
    lastUpdated: string;
    userAgent?: string;
  };
}

/**
 * Información de producto para carrito
 * 
 * @description Datos mínimos necesarios para crear un CartItem.
 */
export interface CartProductInfo {
  /** ID del producto */
  id: string | number;
  
  /** Nombre/variedad del producto */
  name: string;
  
  /** Precio unitario */
  price: number;
  
  /** Moneda del precio */
  currency: Currency;
  
  /** URL de imagen (opcional) */
  imageUrl?: string;
  
  /** Descripción corta (opcional) */
  description?: string;
  
  /** Stock disponible */
  availableStock?: number;
  
  /** Unidad de medida */
  unit?: string;
}