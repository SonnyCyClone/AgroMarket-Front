/**
 * Página de resumen de checkout - AgroMarket
 * 
 * @description Primera etapa del checkout que muestra el resumen
 * del pedido con productos, cantidades y totales antes de proceder
 * con la información de envío.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartItem, CartSummary } from '../../../core/models/cart.model';
import { Product, LegacyProduct } from '../../../core/models/product.model';

/**
 * Componente de resumen de checkout
 * 
 * @description Muestra el resumen del pedido antes de proceder al checkout.
 * Permite revisar productos, cantidades y precios finales.
 */
@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-summary.page.html',
  styleUrl: './checkout-summary.page.css'
})
export class CheckoutSummaryPage implements OnInit, OnDestroy {
  /** Subject para manejar la desuscripción */
  private destroy$ = new Subject<void>();
  
  /** Items del carrito */
  cartItems: CartItem[] = [];
  
  /** Resumen del carrito */
  cartSummary: CartSummary | null = null;
  
  /** Estado de carga */
  loading = false;

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
    this.checkCartEmpty();
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
   * Verifica si el carrito está vacío y redirige si es necesario
   * 
   * @private
   */
  private checkCartEmpty(): void {
    if (this.cartItems.length === 0) {
      this.snackBar.open(
        'El carrito está vacío',
        'Cerrar',
        { duration: 3000 }
      );
      this.router.navigate(['/']);
    }
  }

  /**
   * Procede a la siguiente etapa del checkout (información de envío)
   */
  proceedToShipping(): void {
    if (this.cartItems.length === 0) {
      this.checkCartEmpty();
      return;
    }

    this.router.navigate(['/checkout/shipping']);
  }

  /**
   * Regresa al carrito
   */
  backToCart(): void {
    this.router.navigate(['/cart']);
  }

  /**
   * Regresa a la tienda
   */
  backToShopping(): void {
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
}