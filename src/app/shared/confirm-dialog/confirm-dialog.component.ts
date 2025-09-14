/**
 * Componente de diálogo de confirmación reutilizable
 * 
 * @description Modal genérico para confirmaciones y mensajes de éxito/error.
 * Proporciona un diseño consistente para toda la aplicación con título,
 * mensaje personalizable y acciones de confirmación.
 * 
 * Características:
 * - Modal con backdrop oscuro
 * - Botón de confirmación personalizable
 * - Cierre al hacer clic en backdrop
 * - Eventos para confirmar y cerrar
 * - Completamente accesible con ARIA
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente standalone para mostrar diálogos de confirmación
 * 
 * @description Modal reutilizable que puede usarse para confirmaciones,
 * mensajes de éxito, errores o cualquier notificación que requiera
 * interacción del usuario.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  /** Controla la visibilidad del modal */
  @Input() isVisible = false;
  
  /** Título del diálogo */
  @Input() title = 'Confirmación';
  
  /** Mensaje principal a mostrar */
  @Input() message = '';
  
  /** Texto del botón de confirmación */
  @Input() confirmText = 'OK';
  
  /** Evento emitido cuando el usuario confirma */
  @Output() confirmed = new EventEmitter<void>();
  
  /** Evento emitido cuando el diálogo se cierra */
  @Output() closed = new EventEmitter<void>();

  /**
   * Maneja la confirmación del usuario
   * 
   * @description Emite el evento de confirmación y cierra el modal.
   * Se ejecuta cuando el usuario hace clic en el botón de confirmación.
   */
  onConfirm(): void {
    this.confirmed.emit();
    this.close();
  }

  /**
   * Maneja el clic en el backdrop
   * 
   * @description Cierra el modal solo si el clic fue directamente en el backdrop,
   * no en el contenido del modal.
   * 
   * @param {Event} event - Evento de clic del mouse
   */
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  /**
   * Cierra el modal
   * 
   * @description Oculta el modal y emite el evento de cierre para notificar
   * al componente padre que el diálogo se ha cerrado.
   * 
   * @private
   */
  private close(): void {
    this.isVisible = false;
    this.closed.emit();
  }
}
