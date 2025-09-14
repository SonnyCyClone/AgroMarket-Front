/**
 * Componente de overlay de animaciones fly-to-cart para AgroMarket
 * 
 * @description Componente que renderiza las animaciones de productos
 * "volando" hacia el carrito. Se superpone sobre toda la aplicación
 * y maneja múltiples animaciones simultáneas.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyToCartService, FlyingElement } from '../../core/services/animation/fly-to-cart.service';

/**
 * Componente de overlay para animaciones fly-to-cart
 */
@Component({
  selector: 'app-fly-to-cart-overlay',
  imports: [CommonModule],
  template: `
    <!-- Overlay de animaciones - solo visible cuando hay animaciones activas -->
    <div 
      class="fly-to-cart-overlay"
      [class.active]="flyToCartService.hasActiveAnimations()"
      aria-hidden="true"
    >
      <!-- Elementos volando -->
      @for (element of flyToCartService.activeFlyingElements(); track element.id) {
        <div 
          class="flying-product"
          [style]="getElementStyle(element)"
        >
          <img 
            [src]="element.imageUrl"
            [alt]="'Producto volando al carrito'"
            class="flying-image"
            (error)="onImageError($event)"
          />
          
          <!-- Efecto de estela/trail -->
          <div class="flying-trail"></div>
          
          <!-- Partículas decorativas -->
          <div class="flying-particles">
            <div class="particle particle-1"></div>
            <div class="particle particle-2"></div>
            <div class="particle particle-3"></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    /* ==================== OVERLAY PRINCIPAL ==================== */
    .fly-to-cart-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }

    .fly-to-cart-overlay.active {
      pointer-events: none; /* Siempre none, no interfiere con clicks */
    }

    /* ==================== ELEMENTOS VOLANDO ==================== */
    .flying-product {
      position: absolute;
      width: 60px;
      height: 60px;
      pointer-events: none;
      z-index: 10000;
      transition: none; /* Las animaciones se manejan via transform */
    }

    .flying-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: none;
    }

    /* ==================== EFECTOS VISUALES ==================== */
    .flying-trail {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40px;
      height: 40px;
      background: radial-gradient(
        circle,
        rgba(40, 167, 69, 0.3) 0%,
        rgba(40, 167, 69, 0.1) 50%,
        transparent 100%
      );
      transform: translate(-50%, -50%);
      border-radius: 50%;
      animation: trailPulse 0.6s ease-out infinite alternate;
    }

    @keyframes trailPulse {
      0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0.6;
      }
      100% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0.2;
      }
    }

    /* ==================== PARTÍCULAS DECORATIVAS ==================== */
    .flying-particles {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80px;
      height: 80px;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: #28a745;
      border-radius: 50%;
      opacity: 0.7;
    }

    .particle-1 {
      top: 10%;
      left: 20%;
      animation: particle1Float 0.8s ease-out infinite;
    }

    .particle-2 {
      top: 60%;
      right: 15%;
      animation: particle2Float 0.9s ease-out infinite;
    }

    .particle-3 {
      bottom: 15%;
      left: 60%;
      animation: particle3Float 1s ease-out infinite;
    }

    @keyframes particle1Float {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0.7;
      }
      50% {
        transform: translate(-5px, -8px) scale(1.2);
        opacity: 0.9;
      }
      100% {
        transform: translate(-10px, -15px) scale(0.8);
        opacity: 0.3;
      }
    }

    @keyframes particle2Float {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0.6;
      }
      50% {
        transform: translate(8px, -5px) scale(1.1);
        opacity: 0.8;
      }
      100% {
        transform: translate(15px, -12px) scale(0.7);
        opacity: 0.2;
      }
    }

    @keyframes particle3Float {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0.8;
      }
      50% {
        transform: translate(-3px, 6px) scale(1.3);
        opacity: 1;
      }
      100% {
        transform: translate(-8px, 12px) scale(0.6);
        opacity: 0.1;
      }
    }

    /* ==================== FALLBACK PARA IMÁGENES ==================== */
    .flying-image[src=""],
    .flying-image:not([src]) {
      background: #f8f9fa;
      border: 2px solid #28a745;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .flying-image[src=""]:before,
    .flying-image:not([src]):before {
      content: '📦';
      font-size: 24px;
    }

    /* ==================== RESPONSIVE DESIGN ==================== */
    @media (max-width: 768px) {
      .flying-product {
        width: 50px;
        height: 50px;
      }

      .flying-trail {
        width: 30px;
        height: 30px;
      }

      .flying-particles {
        width: 60px;
        height: 60px;
      }

      .particle {
        width: 3px;
        height: 3px;
      }
    }

    @media (max-width: 480px) {
      .flying-product {
        width: 40px;
        height: 40px;
      }

      .flying-trail {
        width: 25px;
        height: 25px;
      }

      .flying-particles {
        width: 50px;
        height: 50px;
      }

      .particle {
        width: 2px;
        height: 2px;
      }
    }

    /* ==================== MODO REDUCIDO PARA ACCESIBILIDAD ==================== */
    @media (prefers-reduced-motion: reduce) {
      .flying-trail,
      .flying-particles,
      .particle {
        display: none;
      }

      @keyframes trailPulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.5;
        }
      }

      @keyframes particle1Float {
        0%, 100% {
          transform: translate(-10px, -10px);
          opacity: 0.3;
        }
        50% {
          transform: translate(5px, -15px);
          opacity: 0.6;
        }
      }

      @keyframes particle2Float {
        0%, 100% {
          transform: translate(10px, -5px);
          opacity: 0.4;
        }
        50% {
          transform: translate(-5px, -20px);
          opacity: 0.7;
        }
      }

      @keyframes particle3Float {
        0%, 100% {
          transform: translate(-5px, 10px);
          opacity: 0.3;
        }
        50% {
          transform: translate(15px, -10px);
          opacity: 0.5;
        }
      }
    }
  `]
})
export class FlyToCartOverlayComponent implements OnInit, OnDestroy {
  protected flyToCartService = inject(FlyToCartService);

  /**
   * RAF ID para el loop de animación
   */
  private rafId?: number;

  /**
   * Indica si el componente está activo
   */
  private isActive = signal(true);

  ngOnInit(): void {
    this.startAnimationLoop();
  }

  ngOnDestroy(): void {
    this.isActive.set(false);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.flyToCartService.cancelAllAnimations();
  }

  /**
   * Obtiene el estilo CSS para un elemento volando
   * 
   * @param element - Elemento volando
   * @returns Objeto con estilos CSS
   */
  getElementStyle(element: FlyingElement): { [key: string]: string } {
    return this.flyToCartService.getCurrentElementStyle(element);
  }

  /**
   * Maneja errores de carga de imagen
   * 
   * @param event - Evento de error
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    
    // Crear elemento de fallback
    const container = img.parentElement;
    if (container && !container.querySelector('.fallback-icon')) {
      const fallback = document.createElement('div');
      fallback.className = 'fallback-icon';
      fallback.innerHTML = '📦';
      fallback.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        color: #28a745;
      `;
      container.appendChild(fallback);
    }
  }

  /**
   * Inicia el loop de animación para actualizar posiciones
   * 
   * @private
   */
  private startAnimationLoop(): void {
    const animate = () => {
      if (!this.isActive()) {
        return;
      }

      // El servicio ya maneja el cálculo de posiciones basado en tiempo
      // Solo necesitamos triggerar change detection via RAF
      this.rafId = requestAnimationFrame(animate);
    };

    animate();
  }
}