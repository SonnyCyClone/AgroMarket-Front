/**
 * Componente de carrito flotante (FAB) - AgroMarket
 * 
 * @description Botón flotante que muestra el contador de items del carrito
 * y permite acceso rápido a la página del carrito. Incluye animaciones
 * para feedback visual cuando se agregan productos.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { CartUpdateEvent } from '../../core/models/cart.model';

/**
 * Componente FAB de carrito flotante
 * 
 * @description Muestra un botón flotante en la esquina inferior derecha
 * con el contador de items del carrito y animaciones de feedback.
 */
@Component({
  selector: 'app-floating-cart',
  imports: [CommonModule],
  templateUrl: './floating-cart.component.html',
  styleUrl: './floating-cart.component.css'
})
export class FloatingCartComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private router = inject(Router);

  /**
   * Suscripción a updates del carrito
   */
  private cartUpdateSubscription?: Subscription;

  /**
   * Estado de animación
   */
  isAnimating = signal(false);
  showPulse = signal(false);

  /**
   * Contador de items del carrito (reactivo)
   */
  readonly itemCount = computed(() => this.cartService.totalItems());

  /**
   * Indica si el carrito está vacío
   */
  readonly isEmpty = computed(() => this.cartService.isEmpty());

  /**
   * Total del carrito formateado
   */
  readonly formattedTotal = computed(() => {
    const total = this.cartService.total();
    return this.formatPrice(total);
  });

  ngOnInit() {
    this.subscribeToCartUpdates();
  }

  ngOnDestroy() {
    this.cartUpdateSubscription?.unsubscribe();
  }

  /**
   * Maneja el clic en el FAB del carrito
   */
  onCartClick(): void {
    // Prevenir clicks durante animación
    if (this.isAnimating()) {
      return;
    }

    // Navegar a la página del carrito
    this.router.navigate(['/cart']);
  }

  /**
   * Activa la animación de agregado al carrito
   */
  triggerAddAnimation(): void {
    this.isAnimating.set(true);
    this.showPulse.set(true);

    // Resetear animación después de completarse
    setTimeout(() => {
      this.isAnimating.set(false);
      this.showPulse.set(false);
    }, 600);
  }

  /**
   * Formatea un precio en pesos colombianos
   * 
   * @param price - Precio a formatear
   * @returns Precio formateado
   */
  private formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  /**
   * Se suscribe a updates del carrito para activar animaciones
   */
  private subscribeToCartUpdates(): void {
    this.cartUpdateSubscription = this.cartService.cartUpdates.subscribe(
      (event: CartUpdateEvent | null) => {
        if (event && event.action === 'add') {
          this.triggerAddAnimation();
        }
      }
    );
  }
}