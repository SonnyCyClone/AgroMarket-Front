/**
 * Servicio de carrito de compras - AgroMarket
 * 
 * @description Servicio central para el manejo del carrito de compras.
 * Proporciona funcionalidades completas de CRUD, persistencia en localStorage,
 * cálculos automáticos y eventos reactivos.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, debounceTime } from 'rxjs';
import { 
  CartItem, 
  CartState, 
  CartSummary, 
  CartConfig, 
  CartUpdateEvent, 
  AddToCartOptions, 
  CartOperationResult,
  CartStorageData,
  CartProductInfo,
  Currency
} from '../../models/cart.model';
import { Product, LegacyProduct } from '../../models/product.model';

/**
 * Servicio de carrito de compras
 * 
 * @description Maneja el estado del carrito, persistencia en localStorage,
 * cálculos automáticos de totales y notificaciones de cambios.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'agromarket_cart';
  private readonly STORAGE_VERSION = '1.0.0';

  /**
   * Configuración por defecto del carrito
   */
  private readonly defaultConfig: CartConfig = {
    taxRate: 0.19, // IVA Colombia 19%
    baseShippingCost: 15000, // $15,000 COP base
    freeShippingThreshold: 150000, // Envío gratis desde $150,000 COP
    defaultCurrency: 'COP',
    maxQuantityPerItem: 99,
    maxTotalItems: 100
  };

  /**
   * Configuración actual del carrito
   */
  private config = signal<CartConfig>(this.defaultConfig);

  /**
   * Estado reactivo del carrito usando signals
   */
  private cartStateSignal = signal<CartState>(this.createEmptyCartState());

  /**
   * BehaviorSubject para eventos de actualización
   */
  private cartUpdates$ = new BehaviorSubject<CartUpdateEvent | null>(null);

  constructor() {
    this.loadCartFromStorage();
    this.setupAutoSave();
  }

  /**
   * Estado actual del carrito (readonly)
   */
  get cartState(): CartState {
    return this.cartStateSignal();
  }

  /**
   * Observable para escuchar cambios en el carrito
   */
  get cartUpdates(): Observable<CartUpdateEvent | null> {
    return this.cartUpdates$.asObservable().pipe(
      distinctUntilChanged(),
      debounceTime(100) // Evitar updates muy frecuentes
    );
  }

  /**
   * Señales computadas para acceso reactivo
   */
  readonly items = computed(() => this.cartStateSignal().items);
  readonly totalItems = computed(() => this.cartStateSignal().totalItems);
  readonly subtotal = computed(() => this.cartStateSignal().subtotal);
  readonly total = computed(() => this.cartStateSignal().total);
  readonly isEmpty = computed(() => this.cartStateSignal().items.length === 0);

  /**
   * Resumen del carrito (computed)
   */
  readonly summary = computed((): CartSummary => {
    const state = this.cartStateSignal();
    return {
      subtotal: state.subtotal,
      taxes: state.taxes,
      shipping: state.shipping,
      discounts: 0, // TODO: Implementar sistema de descuentos
      total: state.total,
      currency: state.currency,
      itemCount: state.items.length,
      totalUnits: state.totalItems
    };
  });

  /**
   * Agrega un producto al carrito
   * 
   * @param product - Producto a agregar
   * @param options - Opciones adicionales
   * @returns Resultado de la operación
   */
  addToCart(
    product: Product | LegacyProduct, 
    options: AddToCartOptions = {}
  ): CartOperationResult {
    try {
      const quantity = options.quantity || 1;
      const currency = options.currency || this.config().defaultCurrency;
      
      // Obtener información del producto
      const productInfo = this.extractProductInfo(product);
      
      // Validar stock disponible
      if (productInfo.availableStock !== undefined && productInfo.availableStock < quantity) {
        return {
          success: false,
          message: `Stock insuficiente. Solo quedan ${productInfo.availableStock} unidades.`,
          cartState: this.cartState,
          errorCode: 'INSUFFICIENT_STOCK'
        };
      }

      // Validar límites
      if (quantity > this.config().maxQuantityPerItem) {
        return {
          success: false,
          message: `Cantidad máxima por producto: ${this.config().maxQuantityPerItem}`,
          cartState: this.cartState,
          errorCode: 'MAX_QUANTITY_EXCEEDED'
        };
      }

      const currentState = this.cartStateSignal();
      const existingItemIndex = currentState.items.findIndex(
        item => this.getProductId(item.product) === productInfo.id
      );

      let updatedItems: CartItem[];
      let item: CartItem;

      if (existingItemIndex >= 0) {
        // Actualizar item existente
        const existingItem = currentState.items[existingItemIndex];
        const newQuantity = options.replace ? quantity : existingItem.quantity + quantity;
        
        if (newQuantity > this.config().maxQuantityPerItem) {
          return {
            success: false,
            message: `Cantidad máxima por producto: ${this.config().maxQuantityPerItem}`,
            cartState: this.cartState,
            errorCode: 'MAX_QUANTITY_EXCEEDED'
          };
        }

        item = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: newQuantity * existingItem.unitPrice,
          updatedAt: new Date()
        };

        updatedItems = [
          ...currentState.items.slice(0, existingItemIndex),
          item,
          ...currentState.items.slice(existingItemIndex + 1)
        ];
      } else {
        // Crear nuevo item
        item = this.createCartItem(product, quantity, currency, options.customPrice);
        updatedItems = [...currentState.items, item];
      }

      // Validar total de items
      const totalItemsAfterUpdate = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      if (totalItemsAfterUpdate > this.config().maxTotalItems) {
        return {
          success: false,
          message: `Máximo ${this.config().maxTotalItems} items en el carrito`,
          cartState: this.cartState,
          errorCode: 'MAX_TOTAL_ITEMS_EXCEEDED'
        };
      }

      // Actualizar estado
      const newState = this.calculateCartState(updatedItems);
      this.cartStateSignal.set(newState);

      // Emitir evento
      this.emitCartUpdate({
        action: existingItemIndex >= 0 ? 'update' : 'add',
        item,
        cartState: newState,
        timestamp: new Date()
      });

      return {
        success: true,
        message: `${productInfo.name} agregado al carrito`,
        item,
        cartState: newState
      };

    } catch (error) {
      console.error('Error agregando al carrito:', error);
      return {
        success: false,
        message: 'Error interno agregando producto al carrito',
        cartState: this.cartState,
        errorCode: 'INTERNAL_ERROR'
      };
    }
  }

  /**
   * Remueve un item del carrito
   * 
   * @param itemId - ID del item a remover
   * @returns Resultado de la operación
   */
  removeFromCart(itemId: string): CartOperationResult {
    try {
      const currentState = this.cartStateSignal();
      const itemIndex = currentState.items.findIndex(item => item.id === itemId);

      if (itemIndex === -1) {
        return {
          success: false,
          message: 'Item no encontrado en el carrito',
          cartState: this.cartState,
          errorCode: 'ITEM_NOT_FOUND'
        };
      }

      const removedItem = currentState.items[itemIndex];
      const updatedItems = [
        ...currentState.items.slice(0, itemIndex),
        ...currentState.items.slice(itemIndex + 1)
      ];

      const newState = this.calculateCartState(updatedItems);
      this.cartStateSignal.set(newState);

      this.emitCartUpdate({
        action: 'remove',
        item: removedItem,
        cartState: newState,
        timestamp: new Date()
      });

      return {
        success: true,
        message: 'Producto removido del carrito',
        item: removedItem,
        cartState: newState
      };

    } catch (error) {
      console.error('Error removiendo del carrito:', error);
      return {
        success: false,
        message: 'Error interno removiendo producto del carrito',
        cartState: this.cartState,
        errorCode: 'INTERNAL_ERROR'
      };
    }
  }

  /**
   * Actualiza la cantidad de un item
   * 
   * @param itemId - ID del item
   * @param newQuantity - Nueva cantidad
   * @returns Resultado de la operación
   */
  updateItemQuantity(itemId: string, newQuantity: number): CartOperationResult {
    try {
      if (newQuantity <= 0) {
        return this.removeFromCart(itemId);
      }

      if (newQuantity > this.config().maxQuantityPerItem) {
        return {
          success: false,
          message: `Cantidad máxima por producto: ${this.config().maxQuantityPerItem}`,
          cartState: this.cartState,
          errorCode: 'MAX_QUANTITY_EXCEEDED'
        };
      }

      const currentState = this.cartStateSignal();
      const itemIndex = currentState.items.findIndex(item => item.id === itemId);

      if (itemIndex === -1) {
        return {
          success: false,
          message: 'Item no encontrado en el carrito',
          cartState: this.cartState,
          errorCode: 'ITEM_NOT_FOUND'
        };
      }

      const existingItem = currentState.items[itemIndex];
      const previousQuantity = existingItem.quantity;

      const updatedItem: CartItem = {
        ...existingItem,
        quantity: newQuantity,
        totalPrice: newQuantity * existingItem.unitPrice,
        updatedAt: new Date()
      };

      const updatedItems = [
        ...currentState.items.slice(0, itemIndex),
        updatedItem,
        ...currentState.items.slice(itemIndex + 1)
      ];

      const newState = this.calculateCartState(updatedItems);
      this.cartStateSignal.set(newState);

      this.emitCartUpdate({
        action: 'update',
        item: updatedItem,
        previousQuantity,
        cartState: newState,
        timestamp: new Date()
      });

      return {
        success: true,
        message: 'Cantidad actualizada',
        item: updatedItem,
        cartState: newState
      };

    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      return {
        success: false,
        message: 'Error interno actualizando cantidad',
        cartState: this.cartState,
        errorCode: 'INTERNAL_ERROR'
      };
    }
  }

  /**
   * Limpia completamente el carrito
   */
  clearCart(): void {
    const emptyState = this.createEmptyCartState();
    this.cartStateSignal.set(emptyState);

    this.emitCartUpdate({
      action: 'clear',
      cartState: emptyState,
      timestamp: new Date()
    });
  }

  /**
   * Obtiene un item específico del carrito
   * 
   * @param itemId - ID del item
   * @returns Item encontrado o undefined
   */
  getCartItem(itemId: string): CartItem | undefined {
    return this.cartStateSignal().items.find(item => item.id === itemId);
  }

  /**
   * Verifica si un producto está en el carrito
   * 
   * @param productId - ID del producto
   * @returns true si está en el carrito
   */
  isInCart(productId: string | number): boolean {
    return this.cartStateSignal().items.some(
      item => this.getProductId(item.product) === productId.toString()
    );
  }

  /**
   * Obtiene la cantidad de un producto en el carrito
   * 
   * @param productId - ID del producto
   * @returns Cantidad en el carrito (0 si no está)
   */
  getProductQuantity(productId: string | number): number {
    const item = this.cartStateSignal().items.find(
      item => this.getProductId(item.product) === productId.toString()
    );
    return item?.quantity || 0;
  }

  /**
   * Actualiza la configuración del carrito
   * 
   * @param newConfig - Nueva configuración
   */
  updateConfig(newConfig: Partial<CartConfig>): void {
    const currentConfig = this.config();
    const updatedConfig = { ...currentConfig, ...newConfig };
    this.config.set(updatedConfig);
    
    // Recalcular estado con nueva configuración
    const currentState = this.cartStateSignal();
    const newState = this.calculateCartState(currentState.items);
    this.cartStateSignal.set(newState);
  }

  /**
   * Exporta el carrito para backup o transferencia
   * 
   * @returns Datos del carrito serializables
   */
  exportCart(): CartStorageData {
    const state = this.cartStateSignal();
    return {
      items: state.items.map(item => ({
        ...item,
        addedAt: item.addedAt.toISOString(),
        updatedAt: item.updatedAt.toISOString()
      })),
      config: this.config(),
      metadata: {
        version: this.STORAGE_VERSION,
        lastUpdated: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    };
  }

  /**
   * Importa un carrito desde datos externos
   * 
   * @param data - Datos del carrito a importar
   * @returns true si la importación fue exitosa
   */
  importCart(data: CartStorageData): boolean {
    try {
      // Validar version compatibility
      if (data.metadata.version !== this.STORAGE_VERSION) {
        console.warn('Version mismatch en datos del carrito');
      }

      // Reconstruir items
      const items: CartItem[] = data.items.map(itemData => ({
        ...itemData,
        addedAt: new Date(itemData.addedAt),
        updatedAt: new Date(itemData.updatedAt)
      }));

      // Validar y recalcular estado
      const newState = this.calculateCartState(items);
      this.cartStateSignal.set(newState);

      // Actualizar configuración si está presente
      if (data.config) {
        this.config.set(data.config);
      }

      return true;
    } catch (error) {
      console.error('Error importando carrito:', error);
      return false;
    }
  }

  /**
   * Crea un estado vacío del carrito
   * 
   * @returns Estado inicial del carrito
   * @private
   */
  private createEmptyCartState(): CartState {
    const now = new Date();
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
      taxes: 0,
      shipping: 0,
      total: 0,
      currency: this.defaultConfig.defaultCurrency,
      isUpdating: false,
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Crea un nuevo item del carrito
   * 
   * @param product - Producto base
   * @param quantity - Cantidad
   * @param currency - Moneda
   * @param customPrice - Precio personalizado
   * @returns Nuevo CartItem
   * @private
   */
  private createCartItem(
    product: Product | LegacyProduct, 
    quantity: number, 
    currency: Currency,
    customPrice?: number
  ): CartItem {
    const productInfo = this.extractProductInfo(product);
    const unitPrice = customPrice || productInfo.price;
    const now = new Date();

    return {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      product,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
      currency,
      addedAt: now,
      updatedAt: now
    };
  }

  /**
   * Calcula el estado completo del carrito
   * 
   * @param items - Items del carrito
   * @returns Estado calculado
   * @private
   */
  private calculateCartState(items: CartItem[]): CartState {
    const config = this.config();
    const now = new Date();
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxes = subtotal * config.taxRate;
    
    let shipping = 0;
    if (subtotal > 0 && subtotal < config.freeShippingThreshold) {
      shipping = config.baseShippingCost;
    }
    
    const total = subtotal + taxes + shipping;

    return {
      items,
      totalItems,
      subtotal,
      taxes,
      shipping,
      total,
      currency: config.defaultCurrency,
      isUpdating: false,
      createdAt: this.cartStateSignal().createdAt || now,
      updatedAt: now
    };
  }

  /**
   * Extrae información necesaria de un producto
   * 
   * @param product - Producto fuente
   * @returns Información del producto
   * @private
   */
  private extractProductInfo(product: Product | LegacyProduct): CartProductInfo {
    const isLegacy = 'name' in product;
    
    if (isLegacy) {
      const legacyProduct = product as LegacyProduct;
      return {
        id: legacyProduct.id,
        name: legacyProduct.name,
        price: legacyProduct.price,
        currency: 'COP',
        imageUrl: legacyProduct.imageUrl,
        description: legacyProduct.description,
        availableStock: undefined // Legacy products don't have stock info
      };
    } else {
      const apiProduct = product as Product;
      return {
        id: apiProduct.id.toString(),
        name: apiProduct.variedad,
        price: apiProduct.precio,
        currency: 'COP',
        imageUrl: apiProduct.imagenUrl || undefined,
        description: apiProduct.descripcion,
        availableStock: apiProduct.cantidadDisponible
      };
    }
  }

  /**
   * Obtiene el ID de un producto
   * 
   * @param product - Producto
   * @returns ID como string
   * @private
   */
  private getProductId(product: Product | LegacyProduct): string {
    return 'name' in product ? product.id : product.id.toString();
  }

  /**
   * Emite un evento de actualización del carrito
   * 
   * @param event - Evento a emitir
   * @private
   */
  private emitCartUpdate(event: CartUpdateEvent): void {
    this.cartUpdates$.next(event);
  }

  /**
   * Carga el carrito desde localStorage
   * 
   * @private
   */
  private loadCartFromStorage(): void {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const cartData: CartStorageData = JSON.parse(savedData);
        this.importCart(cartData);
      }
    } catch (error) {
      console.warn('Error cargando carrito desde localStorage:', error);
      // Continuar con carrito vacío
    }
  }

  /**
   * Guarda el carrito en localStorage
   * 
   * @private
   */
  private saveCartToStorage(): void {
    try {
      const cartData = this.exportCart();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.warn('Error guardando carrito en localStorage:', error);
    }
  }

  /**
   * Configura auto-guardado en localStorage
   * 
   * @private
   */
  private setupAutoSave(): void {
    // Guardar en localStorage cada vez que cambie el carrito
    this.cartUpdates$.pipe(
      debounceTime(500) // Esperar 500ms antes de guardar
    ).subscribe(() => {
      this.saveCartToStorage();
    });
  }
}