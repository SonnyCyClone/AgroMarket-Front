/**
 * Página principal de AgroMarket - Catálogo de productos
 * 
 * @description Componente que muestra el catálogo de productos obtenidos desde
 * el API real. Incluye filtrado por activos, manejo de imágenes robusto y
 * formateo de precios en COP. Proporciona funcionalidades de ordenamiento.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewChild } from '@angular/core';
import { SidebarFilterComponent } from '../../shared/sidebar-filter/sidebar-filter.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { FloatingCartComponent } from '../../shared/floating-cart/floating-cart.component';
import { EditProductModalComponent, EditProductModalResult } from '../../shared/edit-product-modal/edit-product-modal.component';
import { ProductService } from '../../core/services/product/product.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { Product, LegacyProduct } from '../../core/models/product.model';

/**
 * Componente de la página principal con catálogo de productos
 * 
 * @description Muestra el catálogo de productos activos obtenidos del API real.
 * Incluye funcionalidades de ordenamiento y filtrado. Los productos se obtienen
 * filtrando solo los que tienen activo = true.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarFilterComponent, ProductCardComponent, FloatingCartComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage implements OnInit {
  /** Array de productos activos obtenidos del API */
  products: Product[] = [];
  
  /** Opción de ordenamiento seleccionada */
  sortOption = 'name';
  
  /** Estado de carga de productos */
  loading = true;
  
  /** Mensaje de error si falla la carga */
  errorMessage = '';
  
  /** Mensaje informativo para mostrar al usuario */
  infoMessage = '';
  
  /** Indica si mostrar el mensaje informativo */
  showInfoMessage = false;

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
   * Constructor de la página principal
   * 
   * @param {ProductService} productService - Servicio para operaciones de productos
   * @param {AuthService} authService - Servicio de autenticación
   * @param {ActivatedRoute} route - Ruta activa para obtener query parameters
   * @param {MatDialog} dialog - Servicio de dialogs de Angular Material
   * @param {MatSnackBar} snackBar - Servicio de notificaciones de Angular Material
   * @param {Router} router - Router para navegación
   * @param {CartService} cartService - Servicio del carrito de compras
   */
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private cartService: CartService
  ) {}

  /**
   * Inicialización del componente
   * 
   * @description Se ejecuta después de que Angular inicializa las propiedades
   * del componente. Carga los productos desde el API real y verifica mensajes.
   */
  ngOnInit(): void {
    // Verificar si hay mensajes en query parameters
    this.route.queryParamMap.subscribe(params => {
      const message = params.get('message');
      if (message) {
        this.infoMessage = message;
        this.showInfoMessage = true;
        
        // Ocultar el mensaje después de 10 segundos
        setTimeout(() => {
          this.showInfoMessage = false;
        }, 10000);
      }
    });
    
    this.loadProducts();
  }

  /**
   * Carga los productos desde el API real
   * 
   * @description Obtiene productos activos del endpoint GET /api/Producto.
   * Maneja estados de carga y error. Aplica ordenamiento después de cargar.
   * 
   * @private
   */
  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (products) => {
        // Filtrar solo productos activos
        this.products = products.filter(product => product.activo);
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
   * 
   * @description Método público para reintentar la carga de productos
   * cuando falla la petición inicial.
   */
  retryLoadProducts(): void {
    this.loadProducts();
  }

  /**
   * Maneja el cambio de opción de ordenamiento
   * 
   * @description Se ejecuta cuando el usuario selecciona una nueva opción
   * de ordenamiento desde el dropdown. Actualiza la variable y reordena.
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
   * @description Aplica el ordenamiento correspondiente al array de productos
   * basado en la opción actualmente seleccionada.
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
   * @description Proporciona un identificador único para cada producto en el ngFor,
   * mejorando el rendimiento al evitar re-renderizados innecesarios.
   * 
   * @param {number} index - Índice del producto en el array
   * @param {Product} product - Producto actual
   * @returns {string | number} ID único del producto para tracking
   */
  trackByProductId(index: number, product: Product): string | number {
    return product.id;
  }

  /**
   * Cierra el mensaje informativo
   * 
   * @description Oculta el mensaje informativo mostrado al usuario.
   */
  closeInfoMessage(): void {
    this.showInfoMessage = false;
  }

  /**
   * Verifica si el usuario actual puede editar productos
   * 
   * @description Determina si el usuario tiene permisos para editar productos
   * basado en su rol (AGRICULTOR).
   * 
   * @returns {boolean} True si puede editar productos
   */
  canEditProducts(): boolean {
    return this.authService.canManageProducts();
  }

  /**
   * Maneja el evento de edición de producto
   * 
   * @description Se ejecuta cuando el usuario hace clic en el botón de editar
   * en una tarjeta de producto. Abre el modal de edición con los datos del producto.
   * 
   * @param {Product | LegacyProduct} product - Producto a editar
   */
  onEditProduct(product: Product | LegacyProduct): void {
    // Navigate to edit product page
    
    // Verificar si es un Product (nuevo formato) para abrir el modal
    if ('variedad' in product) {
      // Es un Product nuevo - abrir modal de edición
      this.openEditModal(product);
    } else {
      // Es un LegacyProduct - mostrar mensaje temporal
      this.snackBar.open(
        `Edición no disponible para productos legacy: ${product.name}`,
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  /**
   * Abre el modal de edición de producto
   * 
   * @description Configura y abre el modal de Angular Material para editar
   * un producto. Maneja el resultado del modal (guardar/cancelar).
   * 
   * @param {Product} product - Producto a editar
   * @private
   */
  private openEditModal(product: Product): void {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { product },
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe((result: EditProductModalResult | undefined) => {
      if (result && result.action === 'save' && result.product) {
        this.handleProductUpdate(result.product);
      }
    });
  }

  /**
   * Maneja la actualización de un producto
   * 
   * @description Procesa la actualización del producto usando el servicio.
   * Muestra notificaciones de éxito/error y recarga la lista si es necesario.
   * 
   * @param {Product} updatedProduct - Producto con datos actualizados
   * @private
   */
  private handleProductUpdate(updatedProduct: Product): void {
    this.snackBar.open('Actualizando producto...', '', { duration: 1000 });

    this.productService.updateProduct(updatedProduct).subscribe({
      next: (response) => {
        // Product updated successfully
        
        // Actualizar el producto en la lista local
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }

        this.snackBar.open(
          `Producto "${updatedProduct.variedad}" actualizado exitosamente`,
          'Cerrar',
          { duration: 4000 }
        );
      },
      error: (error) => {
        console.error('Error actualizando producto:', error);
        this.snackBar.open(
          'Error al actualizar el producto. Intenta de nuevo.',
          'Cerrar',
          { duration: 4000 }
        );
      }
    });
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
    // Activar la animación del FAB
    if (this.floatingCart) {
      this.floatingCart.triggerAddAnimation();
    }
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