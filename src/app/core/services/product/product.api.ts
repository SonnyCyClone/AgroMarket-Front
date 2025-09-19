/**
 * Servicio API para productos - Legacy (DEPRECATED)
 * 
 * @description Servicio que mantiene compatibilidad con formularios existentes.
 * Para nuevas implementaciones, usar ProductApiService en http/product-api.service.ts
 * 
 * @deprecated Usar ProductApiService del directorio http para nuevas implementaciones
 * @author AgroMarket Team
 * @since 1.0.0 - Legacy
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductApiService as NewProductApiService } from '../http/product-api.service';
import { Categoria } from '../../models/categoria.model';
import { TipoProducto } from '../../models/tipo-producto.model';
import { Unidad } from '../../models/unidad.model';
import { CreateProductRequest, CreateProductResponse } from '../../models/producto.create';

/**
 * Wrapper del nuevo ProductApiService para compatibilidad
 * 
 * @description Mantiene la interfaz existente mientras delega
 * al nuevo servicio especializado de productos.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  /**
   * Constructor que inyecta el nuevo servicio
   * 
   * @param {NewProductApiService} newProductApi - Nuevo servicio de productos
   */
  constructor(private newProductApi: NewProductApiService) {}

  /**
   * Lista todas las categorías disponibles
   * 
   * @returns {Observable<Categoria[]>} Observable con categorías
   */
  listCategorias(): Observable<Categoria[]> {
    return this.newProductApi.getCategories<Categoria[]>();
  }

  /**
   * Lista todas las unidades disponibles
   * 
   * @returns {Observable<Unidad[]>} Observable con unidades
   */
  listUnidades(): Observable<Unidad[]> {
    return this.newProductApi.getUnits<Unidad[]>();
  }

  /**
   * Lista tipos de producto (sin filtrar por categoría)
   * 
   * @description El API actual no tiene endpoint por categoría,
   * así que retorna todos los tipos disponibles.
   * 
   * @param {number} categoriaId - ID de categoría (no usado actualmente)
   * @returns {Observable<TipoProducto[]>} Observable con tipos de producto
   */
  listTiposByCategoria(categoriaId: number): Observable<TipoProducto[]> {
    // El API actual no tiene filtrado por categoría, retornamos todos
    return this.newProductApi.getProductTypes<TipoProducto[]>();
  }

  /**
   * Obtiene un producto específico por su ID
   * 
   * @description Delega al nuevo servicio para obtener los datos de un producto específico.
   * Útil para cargar datos en formularios de edición.
   * 
   * @param {number} id - ID del producto a obtener
   * @returns {Observable<any>} Observable con el producto específico
   */
  getProductById(id: number): Observable<any> {
    return this.newProductApi.getProductById<any>(id);
  }

  /**
   * Crea un nuevo producto
   * 
   * @description Convierte el request legacy al formato esperado
   * por el nuevo servicio y crea el producto.
   * 
   * @param {CreateProductRequest} request - Datos del producto en formato legacy
   * @returns {Observable<CreateProductResponse>} Observable con respuesta
   */
  createProduct(request: CreateProductRequest): Observable<CreateProductResponse> {
    const formData = new FormData();
    
    // Convertir del formato legacy al formato del API
    formData.append('variedad', request.Variedad);
    formData.append('descripcion', request.Descripcion);
    formData.append('precio', request.Precio.toString());
    formData.append('cantidadDisponible', request.CantidadDisponible.toString());
    formData.append('unidadesId', request.UnidadesId.toString());
    formData.append('idTipoProducto', request.IdTipoProducto.toString());
    formData.append('activo', request.Activo.toString());
    
    // La ImagenUrl en el formato legacy no incluye archivo real
    if (request.ImagenUrl) {
      // TODO: Manejar conversión de URL a archivo si es necesario
      console.warn('ImagenUrl del formato legacy no se puede convertir directamente a archivo');
    }

    return this.newProductApi.createProduct<CreateProductResponse>(formData);
  }
}
