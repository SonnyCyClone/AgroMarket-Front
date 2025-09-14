/**
 * Servicio de animación "fly-to-cart" para AgroMarket
 * 
 * @description Servicio que maneja las animaciones de productos "volando" 
 * desde las tarjetas de producto hacia el FAB del carrito. Incluye efectos
 * visuales suaves y configuraciones de animación personalizables.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable, signal, computed } from '@angular/core';

/**
 * Configuración de la animación fly-to-cart
 */
export interface FlyToCartConfig {
  /** Duración de la animación en ms */
  duration: number;
  /** Ease function CSS */
  easing: string;
  /** Escala inicial de la imagen (0.0 - 1.0) */
  startScale: number;
  /** Escala final de la imagen (0.0 - 1.0) */
  endScale: number;
  /** Opacidad inicial (0.0 - 1.0) */
  startOpacity: number;
  /** Opacidad final (0.0 - 1.0) */
  endOpacity: number;
  /** Rotación durante el vuelo en grados */
  rotation: number;
}

/**
 * Datos del elemento que va a "volar"
 */
export interface FlyingElement {
  /** ID único de la animación */
  id: string;
  /** URL de la imagen del producto */
  imageUrl: string;
  /** Posición inicial (desde donde vuela) */
  startPosition: { x: number; y: number };
  /** Posición final (hacia donde vuela) */
  endPosition: { x: number; y: number };
  /** Timestamp de inicio */
  startTime: number;
  /** Configuración de animación */
  config: FlyToCartConfig;
}

/**
 * Servicio para animaciones fly-to-cart
 */
@Injectable({
  providedIn: 'root'
})
export class FlyToCartService {
  /**
   * Configuración por defecto de animaciones
   */
  private defaultConfig: FlyToCartConfig = {
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    startScale: 1.0,
    endScale: 0.3,
    startOpacity: 1.0,
    endOpacity: 0.8,
    rotation: 15
  };

  /**
   * Mapa de elementos volando actualmente
   */
  private flyingElements = signal<Map<string, FlyingElement>>(new Map());

  /**
   * Lista reactiva de elementos volando
   */
  readonly activeFlyingElements = computed(() => 
    Array.from(this.flyingElements().values())
  );

  /**
   * Indica si hay animaciones activas
   */
  readonly hasActiveAnimations = computed(() => 
    this.flyingElements().size > 0
  );

  /**
   * Inicia una animación fly-to-cart
   * 
   * @param sourceElement - Elemento HTML desde donde inicia la animación
   * @param targetElement - Elemento HTML hacia donde vuela (FAB del carrito)
   * @param imageUrl - URL de la imagen del producto
   * @param config - Configuración opcional de animación
   * @returns Promise que se resuelve cuando la animación termina
   */
  async flyToCart(
    sourceElement: HTMLElement,
    targetElement: HTMLElement,
    imageUrl: string,
    config?: Partial<FlyToCartConfig>
  ): Promise<void> {
    const animationId = this.generateAnimationId();
    const finalConfig = { ...this.defaultConfig, ...config };

    // Obtener posiciones de elementos
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const startPosition = {
      x: sourceRect.left + sourceRect.width / 2,
      y: sourceRect.top + sourceRect.height / 2
    };

    const endPosition = {
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2
    };

    // Crear elemento volando
    const flyingElement: FlyingElement = {
      id: animationId,
      imageUrl,
      startPosition,
      endPosition,
      startTime: Date.now(),
      config: finalConfig
    };

    // Agregar a elementos activos
    this.addFlyingElement(flyingElement);

    // Retornar promise que se resuelve cuando termina la animación
    return new Promise((resolve) => {
      setTimeout(() => {
        this.removeFlyingElement(animationId);
        resolve();
      }, finalConfig.duration);
    });
  }

  /**
   * Obtiene la posición actual de un elemento volando basado en progreso
   * 
   * @param element - Elemento volando
   * @returns Posición actual y transformaciones CSS
   */
  getCurrentElementStyle(element: FlyingElement): {
    left: string;
    top: string;
    transform: string;
    opacity: string;
  } {
    const elapsed = Date.now() - element.startTime;
    const progress = Math.min(elapsed / element.config.duration, 1);

    // Ease function aplicada al progreso
    const easedProgress = this.applyEasing(progress, element.config.easing);

    // Interpolación de posición
    const currentX = this.lerp(
      element.startPosition.x,
      element.endPosition.x,
      easedProgress
    );
    const currentY = this.lerp(
      element.startPosition.y,
      element.endPosition.y,
      easedProgress
    );

    // Interpolación de escala
    const currentScale = this.lerp(
      element.config.startScale,
      element.config.endScale,
      easedProgress
    );

    // Interpolación de opacidad
    const currentOpacity = this.lerp(
      element.config.startOpacity,
      element.config.endOpacity,
      easedProgress
    );

    // Rotación con efecto de sine wave para movimiento natural
    const currentRotation = Math.sin(easedProgress * Math.PI) * element.config.rotation;

    return {
      left: `${currentX}px`,
      top: `${currentY}px`,
      transform: `translate(-50%, -50%) scale(${currentScale}) rotate(${currentRotation}deg)`,
      opacity: currentOpacity.toString()
    };
  }

  /**
   * Cancela todas las animaciones activas
   */
  cancelAllAnimations(): void {
    this.flyingElements.set(new Map());
  }

  /**
   * Cancela una animación específica
   * 
   * @param animationId - ID de la animación a cancelar
   */
  cancelAnimation(animationId: string): void {
    this.removeFlyingElement(animationId);
  }

  /**
   * Agrega un elemento volando al estado
   * 
   * @param element - Elemento a agregar
   * @private
   */
  private addFlyingElement(element: FlyingElement): void {
    const current = new Map(this.flyingElements());
    current.set(element.id, element);
    this.flyingElements.set(current);
  }

  /**
   * Remueve un elemento volando del estado
   * 
   * @param elementId - ID del elemento a remover
   * @private
   */
  private removeFlyingElement(elementId: string): void {
    const current = new Map(this.flyingElements());
    current.delete(elementId);
    this.flyingElements.set(current);
  }

  /**
   * Genera un ID único para la animación
   * 
   * @returns ID único
   * @private
   */
  private generateAnimationId(): string {
    return `fly-animation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Interpolación lineal entre dos valores
   * 
   * @param start - Valor inicial
   * @param end - Valor final
   * @param progress - Progreso (0.0 - 1.0)
   * @returns Valor interpolado
   * @private
   */
  private lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  /**
   * Aplica función de easing al progreso
   * 
   * @param progress - Progreso lineal (0.0 - 1.0)
   * @param easing - Función de easing CSS
   * @returns Progreso con easing aplicado
   * @private
   */
  private applyEasing(progress: number, easing: string): number {
    // Para simplificar, usamos cubic-bezier básico
    // En una implementación más avanzada, se podría parsearse el string CSS
    switch (easing) {
      case 'ease':
        return this.easeInOut(progress);
      case 'ease-in':
        return this.easeIn(progress);
      case 'ease-out':
        return this.easeOut(progress);
      case 'ease-in-out':
        return this.easeInOut(progress);
      default:
        // Para cubic-bezier personalizado, usar approximación
        return this.easeInOut(progress);
    }
  }

  /**
   * Función ease-in (cuadrática)
   * 
   * @param t - Progreso (0.0 - 1.0)
   * @returns Progreso con ease-in aplicado
   * @private
   */
  private easeIn(t: number): number {
    return t * t;
  }

  /**
   * Función ease-out (cuadrática)
   * 
   * @param t - Progreso (0.0 - 1.0)
   * @returns Progreso con ease-out aplicado
   * @private
   */
  private easeOut(t: number): number {
    return 1 - (1 - t) * (1 - t);
  }

  /**
   * Función ease-in-out (cuadrática)
   * 
   * @param t - Progreso (0.0 - 1.0)
   * @returns Progreso con ease-in-out aplicado
   * @private
   */
  private easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
  }
}