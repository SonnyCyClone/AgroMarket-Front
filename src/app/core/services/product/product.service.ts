/**
 * Servicio de productos para AgroMarket
 * 
 * @description Servicio principal que maneja todas las operaciones relacionadas
 * con productos: obtener catálogo, crear productos, filtros y transformaciones.
 * Conecta con el API real y proporciona funcionalidades de respaldo con datos mock.
 * 
 * Funcionalidades principales:
 * - Obtener productos desde API real con filtrado por activos
 * - Crear productos usando FormData según especificación API
 * - Formateo de precios en COP
 * - Manejo robusto de imágenes (URL, base64, placeholder)
 * - Datos mock para desarrollo y testing
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable } from '@angular/core';
import { Observable, map, of, catchError } from 'rxjs';
import { ProductApiService } from '../http/product-api.service';
import { Product, LegacyProduct, CreateProductRequest } from '../../models/product.model';

/**
 * Servicio para gestión de productos
 * 
 * @description Proporciona métodos para obtener, crear y manipular productos.
 * Combina funcionalidad del API real con datos mock para desarrollo.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  /** Clave para almacenar productos mock en localStorage */
  private readonly storageKey = 'agromarket_products';
  
  /** Productos mock para desarrollo */
  private mockProducts: LegacyProduct[] = [];

  /**
   * Constructor del servicio de productos
   * 
   * @param {ProductApiService} productApiService - Servicio para llamadas al API de productos
   */
  constructor(private productApiService: ProductApiService) {
    this.loadMockFromStorage();
    this.seedMockIfEmpty();
  }

  /**
   * Obtiene todos los productos activos desde el API real
   * 
   * @description Realiza GET /api/Producto y filtra solo productos activos.
   * Retorna un Observable que emite el array de productos procesados.
   * 
   * @returns {Observable<Product[]>} Observable con productos activos
   * 
   * @example
   * ```typescript
   * this.productService.getProducts().subscribe(products => {
   *   console.log('Productos activos:', products);
   *   this.displayProducts = products;
   * });
   * ```
   */
  getProducts(): Observable<Product[]> {
    return this.productApiService.getProducts<Product[]>().pipe(
      map((products: Product[]) => {
        // Filtrar solo productos activos
        const activeProducts = products.filter(product => product.activo);
        // Debug log removed
        return activeProducts;
      }),
      catchError(error => {
        console.error('Error obteniendo productos del API, usando datos mock:', error);
        // En caso de error, retornar productos mock convertidos
        return of(this.convertMockToApiFormat());
      })
    );
  }

  /**
   * Crea un nuevo producto usando FormData
   * 
   * @description Envía los datos del producto al endpoint POST /api/Producto
   * usando FormData según la especificación del API.
   * 
   * @param {CreateProductRequest} productData - Datos del producto a crear
   * @returns {Observable<any>} Observable con la respuesta del servidor
   * 
   * @example
   * ```typescript
   * const newProduct: CreateProductRequest = {
   *   variedad: 'Tomate Cherry',
   *   descripcion: 'Tomates frescos de la finca',
   *   precio: 5000,
   *   cantidadDisponible: 100,
   *   unidadesId: 1,
   *   idTipoProducto: 2,
   *   imagen: imageFile,
   *   activo: true
   * };
   * 
   * this.productService.createProduct(newProduct).subscribe(response => {
   *   console.log('Producto creado:', response);
   * });
   * ```
   */
  createProduct(productData: CreateProductRequest): Observable<any> {
    const formData = new FormData();
    
    // Agregar campos según especificación del API
    formData.append('variedad', productData.variedad);
    formData.append('descripcion', productData.descripcion);
    formData.append('precio', productData.precio.toString());
    formData.append('cantidadDisponible', productData.cantidadDisponible.toString());
    formData.append('unidadesId', productData.unidadesId.toString());
    formData.append('idTipoProducto', productData.idTipoProducto.toString());
    formData.append('activo', productData.activo.toString());
    
    // Agregar imagen si existe
    if (productData.imagen) {
      formData.append('imagen', productData.imagen);
    }
    
    return this.productApiService.createProduct(formData);
  }

  /**
   * Actualiza un producto existente usando FormData
   * 
   * @description Envía los datos actualizados del producto al endpoint PUT /api/Producto
   * usando FormData según la especificación del API. Permite actualizar imagen opcional.
   * 
   * @param {Product} product - Producto con datos actualizados
   * @param {File | null} newImage - Nueva imagen opcional (si no se provee, mantiene la actual)
   * @returns {Observable<any>} Observable con la respuesta del servidor
   * 
   * @example
   * ```typescript
   * const updatedProduct: Product = {
   *   ...existingProduct,
   *   variedad: 'Tomate Cherry Premium',
   *   precio: 6000
   * };
   * 
   * this.productService.updateProduct(updatedProduct, newImageFile).subscribe(response => {
   *   console.log('Producto actualizado:', response);
   * });
   * ```
   */
  updateProduct(product: Product, newImage?: File | null): Observable<any> {
    const formData = new FormData();
    
    // Agregar ID del producto para la actualización
    formData.append('id', product.id.toString());
    
    // Agregar campos actualizados según especificación del API
    formData.append('variedad', product.variedad);
    formData.append('descripcion', product.descripcion);
    formData.append('precio', product.precio.toString());
    formData.append('cantidadDisponible', product.cantidadDisponible.toString());
    formData.append('unidadesId', product.unidadesId.toString());
    formData.append('idTipoProducto', product.idTipoProducto.toString());
    formData.append('activo', product.activo.toString());
    
    // Agregar nueva imagen si se proporciona
    if (newImage) {
      formData.append('imagen', newImage);
    }
    
    return this.productApiService.updateProduct(formData);
  }

  /**
   * Formatea un precio en pesos colombianos (COP)
   * 
   * @description Convierte un número a formato de precio colombiano con separadores
   * de miles y símbolo de peso.
   * 
   * @param {number} price - Precio numérico a formatear
   * @returns {string} Precio formateado (ej: "$ 12.345")
   * 
   * @example
   * ```typescript
   * const formatted = this.productService.formatPrice(12345);
   * console.log(formatted); // "$ 12.345"
   * ```
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  /**
   * Procesa URL de imagen para renderizado robusto
   * 
   * @description Maneja diferentes tipos de fuentes de imagen: URLs completas,
   * datos base64, o retorna placeholder por defecto para casos nulos.
   * 
   * @param {string | null} imageUrl - URL de imagen a procesar
   * @returns {string} URL procesada lista para usar en src de img
   * 
   * @example
   * ```typescript
   * const processedUrl = this.productService.processImageUrl(product.imagenUrl);
   * // Retorna: URL completa, data:image/... para base64, o placeholder
   * ```
   */
  processImageUrl(imageUrl: string | null): string {
    if (!imageUrl) {
      return 'assets/icon/placeholder.png';
    }
    
    // Si ya es una URL completa (http/https)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Si es base64 data URL
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    
    // Para otros casos, usar placeholder
    return 'assets/icon/placeholder.png';
  }

  /**
   * Convierte productos mock al formato del API real
   * 
   * @description Transforma productos legacy al nuevo formato para compatibilidad
   * cuando el API no está disponible.
   * 
   * @returns {Product[]} Array de productos en formato API
   * @private
   */
  private convertMockToApiFormat(): Product[] {
    return this.mockProducts.map((mockProduct, index) => ({
      id: parseInt(mockProduct.id) || index + 1,
      variedad: mockProduct.name,
      descripcion: mockProduct.description,
      precio: mockProduct.price,
      cantidadDisponible: 100, // Mock quantity
      unidadesId: 1, // Mock unit ID
      idTipoProducto: 1, // Mock type ID
      imagenUrl: mockProduct.imageUrl,
      activo: true,
      fechaCreacion: mockProduct.createdAt,
      fechaActualizacion: mockProduct.createdAt
    }));
  }

  // === MÉTODOS LEGACY PARA COMPATIBILIDAD ===

  /**
   * Lista productos mock (compatibilidad legacy)
   * 
   * @deprecated Usar getProducts() para obtener datos del API real
   * @returns {LegacyProduct[]} Array de productos mock
   */
  list(): LegacyProduct[] {
    return [...this.mockProducts];
  }

  /**
   * Crea producto mock (compatibilidad legacy)
   * 
   * @deprecated Usar createProduct() para crear en API real
   * @param {Omit<LegacyProduct, 'id' | 'createdAt'>} product - Datos del producto
   * @returns {LegacyProduct} Producto creado
   */
  create(product: Omit<LegacyProduct, 'id' | 'createdAt'>): LegacyProduct {
    const newProduct: LegacyProduct = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    
    this.mockProducts.push(newProduct);
    this.saveMockToStorage();
    return newProduct;
  }

  /**
   * Inicializa datos mock si están vacíos
   * 
   * @private
   */
  private seedMockIfEmpty(): void {
    if (this.mockProducts.length === 0) {
      this.mockProducts = [
        {
          id: '1',
          name: 'Azada Profesional para Jardín',
          category: 'Herramientas',
          brand: 'GardenPro',
          price: 185000,
          discountPercent: 15,
          imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop',
          description: 'Azada resistente para agricultura profesional y jardinería',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Semillas de Tomate Orgánico',
          category: 'Semillas',
          brand: 'EcoGrow',
          price: 50000,
          imageUrl: 'https://images.theconversation.com/files/616601/original/file-20240901-18-g3xyjw.jpg?ixlib=rb-4.1.0&rect=0%2C0%2C5221%2C3691&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip',
          description: 'Semillas orgánicas de tomate premium para alto rendimiento',
          createdAt: '2024-01-16T10:00:00Z'
        },
        {
          id: '3',
          name: 'Kit Invernadero 10x12',
          category: 'Estructuras',
          brand: 'GrowSpace',
          price: 3600000,
          discountPercent: 25,
          imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
          description: 'Kit completo de invernadero con estructura de aluminio',
          createdAt: '2024-01-17T10:00:00Z'
        },
        {
          id: '4',
          name: 'Sistema de Riego Profesional',
          category: 'Riego',
          brand: 'AquaFlow',
          price: 940000,
          imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=300&fit=crop',
          description: 'Sistema de riego automatizado para jardines grandes',
          createdAt: '2024-01-18T10:00:00Z'
        },
        {
          id: '5',
          name: 'Silla Ergonómica de Jardín',
          category: 'Mobiliario',
          brand: 'ComfortGarden',
          price: 315000,
          discountPercent: 10,
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
          description: 'Silla resistente al clima con diseño ergonómico para jardín',
          createdAt: '2024-01-19T10:00:00Z'
        },
        {
          id: '6',
          name: 'Fertilizante Orgánico 25kg',
          category: 'Fertilizantes',
          brand: 'NatureFeed',
          price: 222000,
          imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=300&fit=crop',
          description: 'Fertilizante orgánico premium para todos los cultivos',
          createdAt: '2024-01-20T10:00:00Z'
        }
      ];
      this.saveMockToStorage();
    }
  }

  /**
   * Carga productos mock desde localStorage
   * 
   * @private
   */
  private loadMockFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.mockProducts = JSON.parse(stored);
      } catch (error) {
        this.mockProducts = [];
      }
    }
  }

  /**
   * Guarda productos mock en localStorage
   * 
   * @private
   */
  private saveMockToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.mockProducts));
  }

  /**
   * Genera un ID único para productos mock
   * 
   * @returns {string} ID único generado
   * @private
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
