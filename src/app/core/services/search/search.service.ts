/**
 * Servicio de búsqueda global para AgroMarket
 * 
 * @description Servicio que maneja el estado global de búsqueda de productos.
 * Permite comunicación entre el header y los componentes que muestran productos.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Servicio para gestión de búsqueda global
 * 
 * @description Proporciona estado reactivo para el término de búsqueda
 * y permite que diferentes componentes reaccionen a cambios en la búsqueda.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  /** Término de búsqueda actual como signal */
  private currentSearchTerm = signal<string>('');

  /** BehaviorSubject para compatibilidad con observables */
  private searchTermSubject = new BehaviorSubject<string>('');

  /** Observable del término de búsqueda */
  public searchTerm$ = this.searchTermSubject.asObservable();

  /**
   * Obtiene el término de búsqueda actual
   * 
   * @returns {string} Término de búsqueda actual
   */
  getCurrentSearchTerm(): string {
    return this.currentSearchTerm();
  }

  /**
   * Establece un nuevo término de búsqueda
   * 
   * @description Actualiza el término de búsqueda y notifica a todos los suscriptores.
   * Si el término está vacío, se considera como "buscar todo".
   * 
   * @param {string} term - Nuevo término de búsqueda
   */
  setSearchTerm(term: string): void {
    const cleanTerm = term.trim();
    this.currentSearchTerm.set(cleanTerm);
    this.searchTermSubject.next(cleanTerm);
  }

  /**
   * Limpia el término de búsqueda actual
   * 
   * @description Establece el término de búsqueda como vacío,
   * lo que típicamente significa mostrar todos los productos.
   */
  clearSearch(): void {
    this.setSearchTerm('');
  }

  /**
   * Verifica si hay una búsqueda activa
   * 
   * @returns {boolean} true si hay un término de búsqueda, false si está vacío
   */
  hasActiveSearch(): boolean {
    return this.currentSearchTerm().length > 0;
  }
}