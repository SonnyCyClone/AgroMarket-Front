/**
 * Componente de notificaciones toast para AgroMarket
 * 
 * @description Componente que renderiza las notificaciones toast en la esquina
 * superior derecha con animaciones y estilos del tema verde degradado.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.activeToasts(); track toast.id) {
        <div 
          class="toast toast-{{ toast.type }}"
          [attr.data-toast-id]="toast.id"
          role="alert"
          aria-live="polite">
          
          <div class="toast-content">
            <div class="toast-icon">{{ toast.icon }}</div>
            
            <div class="toast-body">
              @if (toast.title) {
                <div class="toast-title">{{ toast.title }}</div>
              }
              <div class="toast-message">{{ toast.message }}</div>
            </div>

            @if (toast.dismissible) {
              <button 
                class="toast-close"
                (click)="toastService.dismiss(toast.id)"
                aria-label="Cerrar notificación"
                type="button">
                ✕
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .toast {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      padding: 16px;
      min-width: 300px;
      max-width: 400px;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      position: relative;
      overflow: hidden;
    }

    .toast::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .toast-success::before {
      background: linear-gradient(135deg, var(--agro-green-400) 0%, var(--agro-green-500) 100%);
    }

    .toast-error::before {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .toast-warning::before {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .toast-info::before {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .toast-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .toast-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      margin-top: 2px;
    }

    .toast-success .toast-icon {
      color: var(--agro-green-500);
    }

    .toast-error .toast-icon {
      color: #dc2626;
    }

    .toast-warning .toast-icon {
      color: #d97706;
    }

    .toast-info .toast-icon {
      color: #2563eb;
    }

    .toast-body {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--agro-text);
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .toast-message {
      font-size: 13px;
      color: var(--agro-muted);
      line-height: 1.4;
      word-wrap: break-word;
    }

    .toast-close {
      flex-shrink: 0;
      background: none;
      border: none;
      font-size: 16px;
      color: var(--agro-muted);
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .toast-close:hover {
      background: rgba(0, 0, 0, 0.05);
      color: var(--agro-text);
    }

    .toast-close:focus {
      outline: 2px solid var(--agro-green-400);
      outline-offset: 1px;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .toast-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .toast {
        min-width: auto;
        max-width: none;
      }
    }
  `]
})
export class ToastContainerComponent {
  /** Servicio de toast inyectado */
  toastService = inject(ToastService);
}