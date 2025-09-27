/**
 * Componente de tarjeta de producto para AgroMarket
 * 
 * @description Componente reutilizable que muestra la información de un producto
 * en formato de tarjeta. Soporta tanto el formato nuevo de API como el legacy.
 * Incluye manejo robusto de imágenes, formateo de precios en COP y gestión de errores.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, LegacyProduct } from '../../core/models/product.model';
import { getSafeString, truncateText } from '../../core/mappers/product.mapper';

/**
 * Componente de tarjeta de producto
 * 
 * @description Muestra un producto en formato de tarjeta con imagen, información
 * básica y precio. Compatible con formatos nuevo y legacy de productos.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  /** Producto a mostrar (puede ser formato API o legacy) */
  @Input() product!: Product | LegacyProduct;
  
  /** Indica si el usuario puede editar este producto */
  @Input() canEdit = false;
  
  /** Evento emitido cuando se solicita editar el producto */
  @Output() editProduct = new EventEmitter<Product | LegacyProduct>();
  
  /** Evento emitido cuando se hace click en el producto para ver detalles */
  @Output() viewProduct = new EventEmitter<Product | LegacyProduct>();
  
  /** Evento emitido cuando se agrega al carrito */
  @Output() buyProduct = new EventEmitter<{product: Product | LegacyProduct, quantity: number}>();
  
  /** Evento emitido cuando se compra inmediatamente */
  @Output() buyNow = new EventEmitter<{product: Product | LegacyProduct, quantity: number}>();
  
  /** Estado de error de imagen para fallback */
  imageError = false;

  /** URL de imagen actual para manejo de fallback */
  imgSrc: string | null = null;

  /**
   * Precio con descuento aplicado (solo para productos legacy)
   * 
   * @description Calcula el precio final aplicando el descuento si existe.
   * Solo aplica para productos en formato legacy que tienen discountPercent.
   * 
   * @returns {number} Precio con descuento aplicado
   */
  get discountedPrice(): number {
    if (this.isLegacyProduct()) {
      const legacyProduct = this.product as LegacyProduct;
      if (legacyProduct.discountPercent) {
        return legacyProduct.price * (1 - legacyProduct.discountPercent / 100);
      }
      return legacyProduct.price;
    }
    return this.getPrice();
  }

  /**
   * Indica si el producto tiene descuento (solo legacy)
   * 
   * @description Verifica si el producto legacy tiene un descuento válido.
   * Los productos del API nuevo no manejan descuentos por ahora.
   * 
   * @returns {boolean} True si tiene descuento válido
   */
  get hasDiscount(): boolean {
    if (this.isLegacyProduct()) {
      const legacyProduct = this.product as LegacyProduct;
      return !!legacyProduct.discountPercent && legacyProduct.discountPercent > 0;
    }
    return false;
  }

  /**
   * Obtiene el nombre del producto según el formato
   * 
   * @description Retorna el nombre del producto adaptándose al formato:
   * - API nuevo: usa 'variedad' 
   * - Legacy: usa 'name'
   * Maneja valores null/undefined de forma segura.
   * 
   * @returns {string} Nombre del producto (nunca null)
   */
  getName(): string {
    if (this.isLegacyProduct()) {
      return getSafeString((this.product as LegacyProduct)?.name, 'Producto');
    } else {
      return getSafeString((this.product as Product)?.variedad, 'Producto');
    }
  }

  /**
   * Obtiene la descripción del producto según el formato
   * 
   * @description Retorna la descripción adaptándose al formato:
   * - API nuevo: usa 'descripcion'
   * - Legacy: usa 'description'
   * Maneja valores null/undefined de forma segura.
   * 
   * @returns {string} Descripción del producto (nunca null)
   */
  getDescription(): string {
    if (this.isLegacyProduct()) {
      return getSafeString((this.product as LegacyProduct)?.description, 'Sin descripción');
    } else {
      return getSafeString((this.product as Product)?.descripcion, 'Sin descripción');
    }
  }

  /**
   * Obtiene el precio del producto según el formato
   * 
   * @description Retorna el precio adaptándose al formato:
   * - API nuevo: usa 'precio'
   * - Legacy: usa 'price'
   * 
   * @returns {number} Precio del producto
   */
  getPrice(): number {
    if (this.isLegacyProduct()) {
      return (this.product as LegacyProduct).price;
    } else {
      return (this.product as Product).precio;
    }
  }

  /**
   * Obtiene la URL de imagen del producto según el formato
   * 
   * @description Retorna la URL de imagen adaptándose al formato:
   * - API nuevo: usa 'imagenUrl' (puede ser null)
   * - Legacy: usa 'imageUrl' (string)
   * Valida que la URL no esté vacía o sea solo espacios.
   * 
   * @returns {string | null} URL de la imagen o null si no es válida
   */
  getImageUrl(): string | null {
    let url: string | null = null;
    
    if (this.isLegacyProduct()) {
      url = (this.product as LegacyProduct)?.imageUrl || null;
    } else {
      url = (this.product as Product)?.imagenUrl || null;
    }
    
    // Validar que la URL no esté vacía o solo sea espacios
    if (url && getSafeString(url).length > 0) {
      return url.trim();
    }
    
    return null;
  }

  /**
   * Obtiene información adicional del producto (solo legacy)
   * 
   * @description Para productos legacy retorna categoría y marca.
   * Para productos API retorna información de cantidad disponible.
   * 
   * @returns {string} Información adicional a mostrar
   */
  getAdditionalInfo(): string {
    if (this.isLegacyProduct()) {
      const legacyProduct = this.product as LegacyProduct;
      return `${legacyProduct.category} - ${legacyProduct.brand}`;
    } else {
      return `Disponible: ${(this.product as Product).cantidadDisponible} unidades`;
    }
  }

  /**
   * Obtiene ID único del producto para elementos HTML
   * 
   * @description Retorna un ID único adaptándose al formato del producto.
   * Convierte números a string para compatibilidad HTML.
   * 
   * @returns {string} ID único para usar en elementos HTML
   */
  getProductId(): string {
    if (this.isLegacyProduct()) {
      return (this.product as LegacyProduct).id;
    } else {
      return (this.product as Product).id.toString();
    }
  }

  /**
   * Obtiene el porcentaje de descuento (solo legacy)
   * 
   * @description Retorna el porcentaje de descuento para productos legacy.
   * Para productos API retorna 0 ya que no manejan descuentos.
   * 
   * @returns {number} Porcentaje de descuento
   */
  getDiscountPercent(): number {
    if (this.isLegacyProduct()) {
      const legacyProduct = this.product as LegacyProduct;
      return legacyProduct.discountPercent || 0;
    }
    return 0;
  }

  /**
   * Determina si el producto es del formato legacy
   * 
   * @description Type guard que verifica si el producto tiene la estructura legacy
   * basándose en la presencia de la propiedad 'name'.
   * 
   * @returns {boolean} True si es producto legacy
   * @private
   */
  private isLegacyProduct(): boolean {
    return 'name' in this.product;
  }

  /**
   * Maneja errores de carga de imagen
   * 
   * @description Se ejecuta cuando falla la carga de una imagen.
   * Establece el fallback al placeholder estándar.
   * 
   * @param {Event} event - Evento de error de la imagen
   */
  onImageError(event: any): void {
    this.imgSrc = 'assets/img/placeholder.png';
    this.imageError = true;
  }

  /**
   * Obtiene la URL de imagen con fallback a placeholder
   * 
   * @description Retorna la URL de imagen del producto o un placeholder
   * si la imagen original no está disponible o falló al cargar.
   * 
   * @returns {string} URL de imagen o placeholder
   */
  getImageUrlWithFallback(): string {
    const imageUrl = this.getImageUrl();
    
    if (this.imageError || !imageUrl) {
      return 'assets/icon/placeholder.png';
    }
    
    return imageUrl;
  }

  /**
   * Formatea un precio en pesos colombianos
   * 
   * @description Convierte un número a formato de moneda colombiana
   * con separadores de miles y símbolo de peso.
   * 
   * @param {number} price - Precio a formatear
   * @returns {string} Precio formateado (ej: "$ 12.345")
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  /**
   * Maneja la acción de agregar al carrito
   * 
   * @description Se ejecuta cuando el usuario hace clic en "Agregar al Carrito".
   * Emite el evento buyProduct con el producto y cantidad por defecto.
   */
  onAddToCart(event?: Event): void {
    if (event) {
      event.stopPropagation(); // Prevenir propagación al hacer click en el botón
    }
    
    // Emitir evento con producto y cantidad por defecto
    this.buyProduct.emit({
      product: this.product,
      quantity: 1
    });
  }

  /**
   * Maneja la acción de comprar ahora
   * 
   * @description Se ejecuta cuando el usuario hace clic en "Comprar".
   * Emite el evento buyNow con el producto y cantidad por defecto.
   */
  onBuyNow(event?: Event): void {
    if (event) {
      event.stopPropagation(); // Prevenir propagación al hacer click en el botón
    }
    
    // Emitir evento con producto y cantidad por defecto
    this.buyNow.emit({
      product: this.product,
      quantity: 1
    });
  }

  /**
   * Maneja el click en el producto para ver detalles
   */
  onViewProduct(): void {
    this.viewProduct.emit(this.product);
  }

  /**
   * Maneja la acción de editar producto
   * 
   * @description Se ejecuta cuando el usuario hace clic en el botón de edición.
   * Emite el evento editProduct con el producto seleccionado y previene propagación.
   * 
   * @param {Event} event - Evento de click del botón de edición
   */
  onEditProduct(event: Event): void {
    event.stopPropagation(); // Prevenir otros eventos de click en la tarjeta
    this.editProduct.emit(this.product);
  }

  /**
   * Obtiene la cantidad disponible del producto
   * 
   * @description Retorna la cantidad disponible según el tipo de producto.
   * Maneja valores null/undefined con fallback a 0.
   * 
   * @returns {number} Cantidad disponible (nunca negative o NaN)
   */
  getQuantity(): number {
    if (this.isLegacyProduct()) {
      // Para productos legacy, usar un valor por defecto
      return 1;
    }
    const quantity = Number((this.product as Product)?.cantidadDisponible ?? 0);
    return isNaN(quantity) || quantity < 0 ? 0 : quantity;
  }

  /**
   * Obtiene la descripción del producto con fallback seguro
   * 
   * @description Retorna la descripción del producto o un texto por defecto
   * si no está disponible, manejando valores null/undefined.
   * 
   * @returns Descripción del producto o texto por defecto
   */
  getDescripcion(): string {
    if (this.isLegacyProduct()) {
      const legacyProduct = this.product as LegacyProduct;
      return legacyProduct?.description?.trim() || 'Sin descripción disponible';
    } else {
      const apiProduct = this.product as Product;
      return apiProduct?.descripcion?.trim() || 'Sin descripción disponible';
    }
  }
}
