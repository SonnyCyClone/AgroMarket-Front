/**
 * Página de gestión de productos para AgroMarket
 * 
 * @description Página para administrar productos, similar al Home pero con
 * controles de edición visibles para usuarios autorizados (AGRICULTOR).
 * Incluye funcionalidades de carrito, ordenamiento y gestión.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarFilterComponent } from '../../shared/sidebar-filter/sidebar-filter.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { FloatingCartComponent } from '../../shared/floating-cart/floating-cart.component';
import { ProductService } from '../../core/services/product/product.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { Product, LegacyProduct } from '../../core/models/product.model';

@Component({
  selector: 'app-products-manage',
  standalone: true,
  imports: [CommonModule, SidebarFilterComponent, ProductCardComponent, FloatingCartComponent],
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

  /** Referencia al componente de carrito flotante */
  @ViewChild(FloatingCartComponent) floatingCart?: FloatingCartComponent;

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
   * @param {CartService} cartService - Servicio del carrito de compras
   * @param {MatSnackBar} snackBar - Servicio para mostrar notificaciones
   */
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar
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
   * @description Navega a la página de edición del producto.
   * 
   * @param {Product | LegacyProduct} product - Producto a editar
   */
  onEditProduct(product: Product | LegacyProduct): void {
    // Verificar si es un Product (nuevo formato) para navegar a edición
    if ('variedad' in product && product.id) {
      this.router.navigate(['/products/edit', product.id]);
    } else {
      this.snackBar.open(
        'No se puede editar este producto. ID no disponible.',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  /**
   * Maneja la adición de un producto al carrito
   * 
   * @param {Object} event - Evento que contiene producto y cantidad
   */
  onAddToCart(event: {product: Product | LegacyProduct, quantity: number}): void {
    try {
      const result = this.cartService.addToCart(event.product, {
        quantity: event.quantity
      });
      
      if (result.success) {
        // Obtener nombre del producto según su formato
        const productName = this.getProductName(event.product);
        
        this.snackBar.open(
          `"${productName}" agregado al carrito`,
          'Ver carrito',
          { duration: 3000 }
        ).onAction().subscribe(() => {
          this.router.navigate(['/cart']);
        });

        // TODO: Trigger fly-to-FAB animation here
        this.triggerFlyToCartAnimation();
      } else {
        this.snackBar.open(
          result.message || 'No se pudo agregar el producto al carrito',
          'Cerrar',
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      this.snackBar.open(
        'Error inesperado al agregar el producto',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  /**
   * Maneja la compra inmediata de un producto
   * 
   * @param {Object} event - Evento que contiene producto y cantidad
   */
  onBuyNow(event: {product: Product | LegacyProduct, quantity: number}): void {
    try {
      const result = this.cartService.addToCart(event.product, {
        quantity: event.quantity
      });
      
      if (result.success) {
        // Navegar inmediatamente al carrito
        this.router.navigate(['/cart']);
      } else {
        this.snackBar.open(
          result.message || 'No se pudo agregar el producto al carrito',
          'Cerrar',
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Error al comprar producto:', error);
      this.snackBar.open(
        'Error inesperado al procesar la compra',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  /**
   * Placeholder para la animación de volar al carrito
   * TODO: Implementar animación real
   */
  private triggerFlyToCartAnimation(): void {
    this.floatingCart?.triggerAddAnimation();
  }

  /**
   * Abre la vista previa del producto
   * 
   * @param {Product | LegacyProduct} product - Producto a mostrar
   */
  openProductPreview(product: Product | LegacyProduct): void {
    this.router.navigate(['/products', this.getProductId(product)]);
  }

  /**
   * Obtiene el nombre del producto según su formato
   * 
   * @param {Product | LegacyProduct} product - Producto
   * @returns {string} Nombre del producto
   * @private
   */
  private getProductName(product: Product | LegacyProduct): string {
    if ('name' in product) {
      return product.name;
    }
    return product.variedad;
  }

  /**
   * Obtiene el ID del producto según su formato
   * 
   * @param {Product | LegacyProduct} product - Producto
   * @returns {string} ID del producto
   * @private
   */
  private getProductId(product: Product | LegacyProduct): string {
    if ('name' in product) {
      return product.id;
    }
    return product.id.toString();
  }
}
