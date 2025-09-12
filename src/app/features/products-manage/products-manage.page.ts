/**
 * Página de gestión de productos para AgroMarket
 * 
 * @description Página para administrar productos, similar al Home pero con
 * controles de edición visibles para usuarios autorizados (AGRICULTOR).
 * Incluye funcionalidades de ordenamiento y gestión.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarFilterComponent } from '../../shared/sidebar-filter/sidebar-filter.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { EditProductModalComponent, EditProductModalResult } from '../../shared/edit-product-modal/edit-product-modal.component';
import { ProductService } from '../../core/services/product/product.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Product, LegacyProduct } from '../../core/models/product.model';

/**
 * Componente de la página de gestión de productos
 * 
 * @description Muestra el catálogo de productos con controles de gestión
 * habilitados para usuarios AGRICULTOR. Incluye ordenamiento y edición.
 */
@Component({
  selector: 'app-products-manage',
  standalone: true,
  imports: [CommonModule, SidebarFilterComponent, ProductCardComponent, EditProductModalComponent],
  templateUrl: './products-manage.page.html',
  styleUrl: './products-manage.page.css'
})
export class ProductsManagePage implements OnInit {
  /** Array de productos obtenidos del API */
  products: Product[] = [];
  
  /** Opción de ordenamiento seleccionada */
  sortOption = 'name';
  
  /** Estado de carga de productos */
  loading = true;
  
  /** Mensaje de error si falla la carga */
  errorMessage = '';

  /** Control del modal de edición */
  showEditModal = false;
  currentEditProduct: Product | null = null;

  /** Mensajes de éxito y error */
  showSuccessMessage = false;
  showErrorMessage = false;
  successMessage = '';
  modalErrorMessage = '';

  /** Opciones disponibles para ordenamiento de productos */
  sortOptions = [
    { value: 'name', label: 'Nombre A-Z' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'newest', label: 'Más Recientes' }
  ];

  /**
   * Constructor de la página de gestión
   * 
   * @param {ProductService} productService - Servicio para operaciones de productos
   * @param {AuthService} authService - Servicio de autenticación
   * @param {Router} router - Router para navegación
   */
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Inicialización del componente
   */
  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Carga los productos desde el API
   * 
   * @private
   */
  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (products) => {
        // Mostrar todos los productos (activos e inactivos) para gestión
        this.products = products;
        this.sortProducts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage = 'Error al cargar los productos. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  /**
   * Reintenta cargar los productos
   */
  retryLoadProducts(): void {
    this.loadProducts();
  }

  /**
   * Maneja el cambio de opción de ordenamiento
   * 
   * @param {Event} event - Evento del select de ordenamiento
   */
  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortOption = target.value;
    this.sortProducts();
  }

  /**
   * Ordena los productos según la opción seleccionada
   * 
   * @private
   */
  private sortProducts(): void {
    switch (this.sortOption) {
      case 'name':
        this.products.sort((a, b) => a.variedad.localeCompare(b.variedad));
        break;
      case 'price-low':
        this.products.sort((a, b) => a.precio - b.precio);
        break;
      case 'price-high':
        this.products.sort((a, b) => b.precio - a.precio);
        break;
      case 'newest':
        this.products.sort((a, b) => 
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
        break;
    }
  }

  /**
   * Función de tracking para ngFor optimizada
   * 
   * @param {number} index - Índice del producto en el array
   * @param {Product} product - Producto actual
   * @returns {string | number} ID único del producto para tracking
   */
  trackByProductId(index: number, product: Product): string | number {
    return product.id;
  }

  /**
   * Verifica si el usuario actual puede editar productos
   * 
   * @returns {boolean} True si puede editar productos
   */
  canEditProducts(): boolean {
    return this.authService.canManageProducts();
  }

  /**
   * Maneja el evento de edición de producto
   * 
   * @description Abre un modal de edición de productos usando CSS-only
   * para mejorar la experiencia del usuario.
   * 
   * @param {Product | LegacyProduct} product - Producto a editar
   */
  onEditProduct(product: Product | LegacyProduct): void {
    // Verificar si es un Product (nuevo formato) para abrir modal
    if ('variedad' in product && product.id) {
      // Abrir modal de edición CSS-only
      this.openEditModal(product as Product);
    } else {
      this.showError('No se puede editar este producto. ID no disponible.');
    }
  }

  /**
   * Abre el modal de edición de producto
   * 
   * @param {Product} product - Producto a editar
   * @private
   */
  private openEditModal(product: Product): void {
    this.currentEditProduct = product;
    this.showEditModal = true;
    
    // Deshabilitar scroll del body
    document.body.style.overflow = 'hidden';
  }

  /**
   * Maneja el cierre del modal de edición
   * 
   * @param {EditProductModalResult} result - Resultado del modal
   */
  onModalClose(result: EditProductModalResult): void {
    this.showEditModal = false;
    this.currentEditProduct = null;
    
    // Rehabilitar scroll del body
    document.body.style.overflow = 'auto';

    if (result && result.action === 'save' && result.product) {
      this.handleProductUpdate(result.product);
    }
  }

  /**
   * Maneja la actualización de un producto
   * 
   * @param {Product} updatedProduct - Producto con datos actualizados
   * @private
   */
  private handleProductUpdate(updatedProduct: Product): void {
    // El modal ya realizó la actualización al API,
    // solo necesitamos actualizar la lista local
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }

    this.showSuccess(`Producto "${updatedProduct.variedad}" actualizado exitosamente`);
  }

  /**
   * Muestra mensaje de éxito
   * 
   * @param {string} message - Mensaje a mostrar
   * @private
   */
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessMessage = true;
    this.showErrorMessage = false;
    
    // Auto-ocultar después de 4 segundos
    setTimeout(() => {
      this.dismissSuccessMessage();
    }, 4000);
  }

  /**
   * Muestra mensaje de error
   * 
   * @param {string} message - Mensaje a mostrar
   * @private
   */
  private showError(message: string): void {
    this.modalErrorMessage = message;
    this.showErrorMessage = true;
    this.showSuccessMessage = false;
    
    // Auto-ocultar después de 6 segundos
    setTimeout(() => {
      this.dismissErrorMessage();
    }, 6000);
  }

  /**
   * Oculta mensaje de éxito
   */
  dismissSuccessMessage(): void {
    this.showSuccessMessage = false;
    this.successMessage = '';
  }

  /**
   * Oculta mensaje de error
   */
  dismissErrorMessage(): void {
    this.showErrorMessage = false;
    this.modalErrorMessage = '';
  }
}
