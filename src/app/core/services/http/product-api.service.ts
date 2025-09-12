/**
 * Servicio HTTP para operaciones de Productos en AgroMarket
 * 
 * @description Servicio especializado para manejar todas las operaciones relacionadas
 * con productos: catálogo, registro, actualización, categorías, tipos y unidades.
 * Conecta con el dominio de productos según la colección Postman.
 * 
 * Endpoints soportados:
 * - GET /api/Producto - Obtener catálogo de productos
 * - POST /api/Producto - Crear nuevo producto (FormData)
 * - GET /api/Categoria - Obtener categorías disponibles
 * - GET /api/TipoProducto - Obtener tipos de producto
 * - GET /api/Uniodades - Obtener unidades de medida
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { environment } from '../../../../environments/environment';

/**
 * Servicio para operaciones HTTP del dominio de Productos
 * 
 * @description Extiende BaseHttpService para proporcionar métodos específicos
 * para operaciones de productos. Utiliza la URL base de productos configurada
 * en environment y soporta overrides por localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductApiService extends BaseHttpService {
  
  /**
   * Constructor del servicio de API de productos
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular
   */
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Obtiene la URL base para servicios de productos
   * 
   * @description Implementa el método abstracto de BaseHttpService.
   * Utiliza environment.getProductApiUrl() que verifica overrides en localStorage.
   * 
   * @returns {string} URL base para peticiones de productos
   * @protected
   */
  protected getBaseUrl(): string {
    return environment.getProductApiUrl();
  }

  /**
   * Obtiene el catálogo completo de productos
   * 
   * @description Realiza GET /api/Producto para obtener todos los productos.
   * La respuesta incluye productos activos e inactivos; el filtrado por 'activo'
   * debe realizarse en el componente consumidor.
   * 
   * @template T - Tipo de dato esperado (típicamente Product[])
   * @returns {Observable<T>} Observable con el array de productos
   * 
   * @example
   * ```typescript
   * this.productApi.getProducts<Product[]>().subscribe(products => {
   *   const activeProducts = products.filter(p => p.activo);
   *   console.log('Productos activos:', activeProducts);
   * });
   * ```
   */
  getProducts<T>(): Observable<T> {
    return this.get<T>('/api/Producto');
  }

  /**
   * Obtiene un producto específico por su ID
   * 
   * @description Realiza GET /api/Producto/{id} para obtener los datos completos
   * de un producto específico. Útil para cargar datos en formularios de edición.
   * 
   * @template T - Tipo de dato esperado (típicamente Product)
   * @param {number} id - ID del producto a obtener
   * @returns {Observable<T>} Observable con el producto específico
   * 
   * @example
   * ```typescript
   * this.productApi.getProductById<Product>(2).subscribe(product => {
   *   this.editForm.patchValue({
   *     variedad: product.variedad,
   *     descripcion: product.descripcion,
   *     precio: product.precio
   *   });
   * });
   * ```
   */
  getProductById<T>(id: number): Observable<T> {
    return this.get<T>(`/api/Producto/${id}`);
  }

  /**
   * Crea un nuevo producto usando FormData
   * 
   * @description Realiza POST /api/Producto con FormData según especificación Postman.
   * El FormData debe incluir: variedad, descripcion, precio, cantidadDisponible,
   * unidadesId, idTipoProducto, imagen (file), activo.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {FormData} productData - Datos del producto en formato FormData
   * @returns {Observable<T>} Observable con la respuesta del servidor
   * 
   * @example
   * ```typescript
   * const formData = new FormData();
   * formData.append('variedad', 'Tomate Cherry');
   * formData.append('descripcion', 'Tomates frescos de la finca');
   * formData.append('precio', '5000');
   * formData.append('cantidadDisponible', '100');
   * formData.append('unidadesId', '1');
   * formData.append('idTipoProducto', '2');
   * formData.append('imagen', imageFile);
   * formData.append('activo', 'true');
   * 
   * this.productApi.createProduct(formData).subscribe(response => {
   *   console.log('Producto creado:', response);
   * });
   * ```
   */
  createProduct<T>(productData: FormData): Observable<T> {
    return this.postFormData<T>('/api/Producto', productData);
  }

  /**
   * Actualiza un producto existente usando FormData
   * 
   * @description Realiza PUT /api/Producto con FormData según especificación Postman.
   * El FormData debe incluir todos los campos del producto incluyendo el campo Id
   * para identificar el producto a actualizar.
   * 
   * @template T - Tipo de dato esperado en la respuesta
   * @param {FormData} productData - Datos del producto incluyendo Id en formato FormData
   * @returns {Observable<T>} Observable con la respuesta del servidor
   * 
   * @example
   * ```typescript
   * const formData = new FormData();
   * formData.append('Id', '2'); // ID del producto a actualizar
   * formData.append('variedad', 'Tomate Cherry Actualizado');
   * formData.append('descripcion', 'Descripción actualizada');
   * formData.append('precio', '6000');
   * formData.append('cantidadDisponible', '150');
   * formData.append('unidadesId', '1');
   * formData.append('idTipoProducto', '2');
   * formData.append('imagen', imageFile);
   * formData.append('activo', 'true');
   * 
   * this.productApi.updateProduct(formData).subscribe(response => {
   *   console.log('Producto actualizado:', response);
   * });
   * ```
   */
  updateProduct<T>(productData: FormData): Observable<T> {
    return this.putFormData<T>('/api/Producto', productData);
  }

  /**
   * Obtiene todas las categorías disponibles
   * 
   * @description Realiza GET /api/Categoria para obtener el catálogo de categorías.
   * Útil para poblar dropdowns de selección en formularios de productos.
   * 
   * @template T - Tipo de dato esperado (típicamente Categoria[])
   * @returns {Observable<T>} Observable con el array de categorías
   * 
   * @example
   * ```typescript
   * this.productApi.getCategories<Categoria[]>().subscribe(categories => {
   *   const activeCategories = categories.filter(c => c.activo);
   *   this.categoryOptions = activeCategories.map(c => ({
   *     value: c.id,
   *     label: `${c.sigla} - ${c.descripcion}`
   *   }));
   * });
   * ```
   */
  getCategories<T>(): Observable<T> {
    return this.get<T>('/api/Categoria');
  }

  /**
   * Obtiene tipos de producto por categoría
   * 
   * @description Realiza GET /api/TipoProducto/Categoria/{categoriaId} para obtener 
   * los tipos de producto filtrados por categoría específica.
   * Usado para clasificar productos en el formulario de registro.
   * 
   * @template T - Tipo de dato esperado (típicamente TipoProducto[])
   * @param {number} categoriaId - ID de la categoría para filtrar tipos (default: 2)
   * @returns {Observable<T>} Observable con el array de tipos de producto
   * 
   * @example
   * ```typescript
   * this.productApi.getProductTypes<TipoProducto[]>(2).subscribe(types => {
   *   const activeTypes = types.filter(t => t.activo);
   *   this.productTypeOptions = activeTypes.map(t => ({
   *     value: t.id,
   *     label: t.nombre
   *   }));
   * });
   * ```
   */
  getProductTypes<T>(categoriaId: number = 2): Observable<T> {
    return this.get<T>(`/api/TipoProducto/Categoria/${categoriaId}`);
  }

  /**
   * Obtiene todas las unidades de medida disponibles
   * 
   * @description Realiza GET /api/Uniodades para obtener las unidades de medida.
   * Nota: El endpoint tiene un typo en la colección Postman ("Uniodades" en lugar de "Unidades").
   * 
   * @template T - Tipo de dato esperado (típicamente Unidad[])
   * @returns {Observable<T>} Observable con el array de unidades
   * 
   * @example
   * ```typescript
   * this.productApi.getUnits<Unidad[]>().subscribe(units => {
   *   const activeUnits = units.filter(u => u.activo);
   *   this.unitOptions = activeUnits.map(u => ({
   *     value: u.id,
   *     label: `${u.sigla} - ${u.descripcion}`
   *   }));
   * });
   * ```
   */
  getUnits<T>(): Observable<T> {
    return this.get<T>('/api/Uniodades'); // Mantener typo del endpoint real
  }
}
