/**
 * Componente de barra de búsqueda para productos
 * 
 * @description Barra de búsqueda que permite al usuario buscar productos
 * en el catálogo usando la API de búsqueda. Emite eventos de búsqueda
 * para que otros componentes puedan reaccionar a los cambios.
 * 
 * Características:
 * - Input de texto con placeholder informativo en español
 * - Búsqueda al presionar Enter o hacer clic en la lupa
 * - Emisión de eventos de búsqueda
 * - Integración con servicio de búsqueda de productos
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Componente standalone para búsqueda de productos
 * 
 * @description Proporciona una interfaz de búsqueda funcional que se comunica
 * con el servicio de productos para filtrar el catálogo.
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  private router = inject(Router);

  /** Término de búsqueda actual */
  searchQuery = '';

  /** Evento emitido cuando se realiza una búsqueda */
  @Output() searchEvent = new EventEmitter<string>();

  /**
   * Ejecuta la búsqueda de productos
   * 
   * @description Emite el término de búsqueda para que los componentes
   * padre puedan realizar la búsqueda correspondiente. Si está vacío,
   * emite cadena vacía para mostrar todos los productos.
   */
  onSearch(): void {
    const query = this.searchQuery.trim();
    this.searchEvent.emit(query);
  }

  /**
   * Maneja las teclas presionadas en el input de búsqueda
   * 
   * @description Ejecuta la búsqueda cuando el usuario presiona Enter,
   * proporcionando una experiencia más fluida sin necesidad de hacer clic
   * en el botón de búsqueda.
   * 
   * @param {KeyboardEvent} event - Evento de tecla presionada
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
