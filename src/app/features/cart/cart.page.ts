/**
 * Página del carrito de compras - AgroMarket
 * 
 * @description Componente que muestra el contenido del carrito de compras
 * con líneas de producto, controles de cantidad, resumen de precios y
 * opciones para proceder al checkout.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { CartItem, CartSummary } from '../../core/models/cart.model';
import { Product, LegacyProduct } from '../../core/models/product.model';

/**
 * Componente de la página del carrito
 * 
 * @description Muestra los productos agregados al carrito con opciones
 * para modificar cantidades, eliminar items y proceder al checkout.
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.css'
})
export class CartPage implements OnInit, OnDestroy {
  /** Subject para manejar la desuscripción */
  private destroy$ = new Subject<void>();
  
  /** Items del carrito */
  cartItems: CartItem[] = [];
  
  /** Resumen del carrito */
  cartSummary: CartSummary | null = null;
  
  /** Estado de carga */
  loading = false;
  
  /** Mensaje de error */
  errorMessage = '';

  /** Estado de error de imagen para fallback */
  imageError = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Inicialización del componente
   */
  ngOnInit(): void {
    this.loadCartData();
    this.subscribeToCartChanges();
  }

  /**
   * Limpieza al destruir el componente
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los datos del carrito
   * 
   * @private
   */
  private loadCartData(): void {
    this.cartItems = this.cartService.items();
    this.cartSummary = this.cartService.summary();
  }

  /**
   * Se suscribe a los cambios del carrito
   * 
   * @private
   */
  private subscribeToCartChanges(): void {
    this.cartService.cartUpdates
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadCartData();
      });
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   * 
   * @param {string} itemId - ID del item en el carrito
   * @param {number} newQuantity - Nueva cantidad
   */
  updateQuantity(itemId: string, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(itemId);
      return;
    }

    try {
      const result = this.cartService.updateItemQuantity(itemId, newQuantity);
      
      if (!result.success) {
        this.snackBar.open(
          result.message || 'Error al actualizar la cantidad',
          'Cerrar',
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      this.snackBar.open(
        'Error inesperado al actualizar la cantidad',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  /**
   * Incrementa la cantidad de un producto
   * 
   * @param {string} itemId - ID del item en el carrito
   */
  incrementQuantity(itemId: string): void {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      this.updateQuantity(itemId, item.quantity + 1);
    }
  }

  /**
   * Decrementa la cantidad de un producto
   * 
   * @param {string} itemId - ID del item en el carrito
   */
  decrementQuantity(itemId: string): void {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      this.updateQuantity(itemId, item.quantity - 1);
    }
  }

  /**
   * Elimina un item del carrito
   * 
   * @param {string} itemId - ID del item a eliminar
   */
  removeItem(itemId: string): void {
    const item = this.cartItems.find(i => i.id === itemId);
    if (!item) return;

    const productName = this.getProductName(item.product);
    
    try {
      const result = this.cartService.removeFromCart(itemId);
      
      if (result.success) {
        this.snackBar.open(
          `"${productName}" eliminado del carrito`,
          'Cerrar',
          { duration: 3000 }
        );
      } else {
        this.snackBar.open(
          result.message || 'Error al eliminar el producto',
          'Cerrar',
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Error al eliminar item:', error);
      this.snackBar.open(
        'Error inesperado al eliminar el producto',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  /**
   * Limpia todo el carrito
   */
  clearCart(): void {
    if (this.cartItems.length === 0) return;

    try {
      this.cartService.clearCart();
      
      this.snackBar.open(
        'Carrito vaciado',
        'Cerrar',
        { duration: 3000 }
      );
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      this.snackBar.open(
        'Error inesperado al vaciar el carrito',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  /**
   * Procede al checkout
   */
  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.snackBar.open(
        'El carrito está vacío',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    // Navegar a la página de checkout
    this.router.navigate(['/checkout']);
  }

  /**
   * Navega de vuelta a la página de productos
   */
  continueShopping(): void {
    this.router.navigate(['/']);
  }

  /**
   * Obtiene el nombre del producto según su formato
   * 
   * @param {Product | LegacyProduct} product - Producto
   * @returns {string} Nombre del producto
   */
  getProductName(product: Product | LegacyProduct): string {
    if ('name' in product) {
      return product.name;
    }
    return product.variedad;
  }

  /**
   * Obtiene la URL de imagen del producto
   * 
   * @param {Product | LegacyProduct} product - Producto
   * @returns {string | null} URL de la imagen
   */
  getProductImageUrl(product: Product | LegacyProduct): string | null {
    if ('imageUrl' in product) {
      return product.imageUrl;
    }
    return product.imagenUrl;
  }

  /**
   * Obtiene la descripción del producto
   * 
   * @param {Product | LegacyProduct} product - Producto
   * @returns {string} Descripción del producto
   */
  getProductDescription(product: Product | LegacyProduct): string {
    if ('description' in product) {
      return product.description;
    }
    return product.descripcion;
  }

  /**
   * Formatea un precio en pesos colombianos
   * 
   * @param {number} price - Precio a formatear
   * @returns {string} Precio formateado
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
   * Indica si el carrito está vacío
   */
  get isEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  /**
   * Obtiene el número total de items en el carrito
   */
  get totalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * TrackBy function para optimizar el rendering de la lista
   * 
   * @param {number} index - Índice del item
   * @param {CartItem} item - Item del carrito
   * @returns {string} ID único del item
   */
  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  /**
   * Maneja errores de carga de imagen
   * 
   * @param {Event} event - Evento de error de la imagen
   */
  onImageError(event: any): void {
    this.imageError = true;
    event.target.style.display = 'none';
  }
}