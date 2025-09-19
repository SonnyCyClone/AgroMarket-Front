/**
 * Servicio de notificaciones toast para AgroMarket
 * 
 * @description Servicio para mostrar notificaciones tipo toast en la esquina 
 * superior derecha con el tema verde degradado del proyecto.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable, signal, computed } from '@angular/core';

/**
 * Tipos de notificación disponibles
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interfaz para una notificación toast
 */
export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
  icon: string;
  timestamp: number;
  dismissible: boolean;
}

/**
 * Servicio para manejar notificaciones toast
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  /** Lista de toasts activos */
  private toasts = signal<Toast[]>([]);

  /** Computed para obtener toasts ordenados por timestamp */
  public activeToasts = computed(() => 
    this.toasts().sort((a, b) => b.timestamp - a.timestamp)
  );

  /** Contador para IDs únicos */
  private idCounter = 0;

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, title?: string, duration: number = 4000): void {
    this.show({
      type: 'success',
      title,
      message,
      duration,
      icon: '✔',
      dismissible: true
    });
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, title?: string, duration: number = 7000): void {
    this.show({
      type: 'error',
      title,
      message,
      duration,
      icon: '⚠',
      dismissible: true
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, title?: string, duration: number = 5000): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration,
      icon: '⚠',
      dismissible: true
    });
  }

  /**
   * Muestra una notificación de información
   */
  info(message: string, title?: string, duration: number = 4000): void {
    this.show({
      type: 'info',
      title,
      message,
      duration,
      icon: 'ℹ',
      dismissible: true
    });
  }

  /**
   * Muestra una notificación personalizada
   */
  private show(config: Omit<Toast, 'id' | 'timestamp'>): void {
    const toast: Toast = {
      id: this.generateId(),
      timestamp: Date.now(),
      ...config
    };

    // Agregar el toast a la lista
    this.toasts.update(toasts => [...toasts, toast]);

    // Auto-remover después del tiempo especificado
    if (config.duration > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, config.duration);
    }
  }

  /**
   * Descarta una notificación específica
   */
  dismiss(id: string): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  /**
   * Descarta todas las notificaciones
   */
  dismissAll(): void {
    this.toasts.set([]);
  }

  /**
   * Genera un ID único para las notificaciones
   */
  private generateId(): string {
    return `toast-${++this.idCounter}-${Date.now()}`;
  }

  /**
   * Obtiene el número de toasts activos
   */
  getActiveCount(): number {
    return this.toasts().length;
  }
}