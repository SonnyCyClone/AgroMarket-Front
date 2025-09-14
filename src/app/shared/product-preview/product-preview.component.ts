/**
 * Página de vista previa de producto - AgroMarket
 * 
 * @description Página standalone que muestra detalles completos del producto
 * similar a las vistas de marketplace con galería de imágenes, información
 * detallada y opciones de compra directa con integración al carrito.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product, LegacyProduct } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart/cart.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProductService } from '../../core/services/product/product.service';

/**
 * Componente de vista previa de producto
 * 
 * @description Modal que muestra información completa del producto con
 * opciones de compra, gestión de cantidad y navegación a checkout.
 */
@Component({
  selector: 'app-product-preview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-preview.component.html',
  styleUrl: './product-preview.component.css'
})
export class ProductPreviewComponent implements OnInit, OnDestroy {
  /** Subject para manejar la desuscripción */
  private destroy$ = new Subject<void>();

  /** Producto a mostrar */
  product!: Product | LegacyProduct;
  
  /** Indica si se puede editar el producto */
  canEdit!: boolean;

  /** Formulario de cantidad */
  quantityForm!: FormGroup;

  /** Estado de carga */
  loading = false;

  /** Estado de error de imagen */
  imageError = false;

  /** Índice de imagen activa en la galería */
  activeImageIndex = 0;

  /** Lista de imágenes para la galería */
  imageGallery: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Inicialización del componente
   */
  ngOnInit(): void {
    this.loadProductFromRoute();
    this.initializeForm();
    this.setupImageGallery();
  }

  /**
   * Carga el producto desde los parámetros de la ruta
   * 
   * @private
   */
  private loadProductFromRoute(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    const canEdit = this.route.snapshot.queryParamMap.get('canEdit') === 'true';
    
    if (productId) {
      // TODO: Cargar producto desde el servicio usando el ID
      // Por ahora usamos datos mock para la demostración
      this.product = {
        id: parseInt(productId),
        name: 'Producto de ejemplo',
        description: 'Descripción del producto',
        price: 25000,
        imageUrl: '/assets/icon/placeholder.png'
      } as any; // Temporal mock data
      this.canEdit = canEdit;
    } else {
      // Si no hay ID, navegar de vuelta
      this.router.navigate(['/']);
    }
  }

  /**
   * Limpieza al destruir el componente
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el formulario de cantidad
   * 
   * @private
   */
  private initializeForm(): void {
    const maxQuantity = this.getAvailableQuantity();
    
    this.quantityForm = this.formBuilder.group({
      quantity: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(Math.max(1, maxQuantity))
      ]]
    });
  }

  /**
   * Configura la galería de imágenes
   * 
   * @private
   */
  private setupImageGallery(): void {
    const mainImage = this.getProductImageUrl();
    if (mainImage) {
      this.imageGallery = [mainImage];
      // TODO: En el futuro se pueden agregar más imágenes del producto
    }
  }

  /**
   * Obtiene el nombre del producto según su formato
   */
  getProductName(): string {
    if ('name' in this.product) {
      return this.product.name;
    }
    return this.product.variedad;
  }

  /**
   * Obtiene la descripción del producto
   */
  getProductDescription(): string {
    if ('description' in this.product) {
      return this.product.description;
    }
    return this.product.descripcion;
  }

  /**
   * Obtiene el precio del producto
   */
  getProductPrice(): number {
    if ('price' in this.product) {
      return this.product.price;
    }
    return this.product.precio;
  }

  /**
   * Obtiene la URL de imagen del producto
   */
  getProductImageUrl(): string | null {
    if ('imageUrl' in this.product) {
      return this.product.imageUrl;
    }
    return this.product.imagenUrl;
  }

  /**
   * Obtiene la cantidad disponible del producto
   */
  getAvailableQuantity(): number {
    if ('cantidadDisponible' in this.product) {
      return this.product.cantidadDisponible;
    }
    // Para productos legacy, usar un valor por defecto
    return 10;
  }

  /**
   * Obtiene el ID del producto
   */
  getProductId(): string | number {
    if ('name' in this.product) {
      // Es un producto legacy
      return this.product.id;
    }
    // Es un producto del API
    return this.product.id;
  }

  /**
   * Obtiene información adicional del producto
   */
  getAdditionalInfo(): string[] {
    const info: string[] = [];
    
    if ('cantidadDisponible' in this.product) {
      info.push(`Disponible: ${this.product.cantidadDisponible} unidades`);
      info.push(`Producto: ${this.product.activo ? 'Activo' : 'Inactivo'}`);
    } else {
      // Producto legacy
      const legacyProduct = this.product as LegacyProduct;
      if (legacyProduct.category) info.push(`Categoría: ${legacyProduct.category}`);
      if (legacyProduct.brand) info.push(`Marca: ${legacyProduct.brand}`);
    }
    
    return info;
  }

  /**
   * Formatea un precio en pesos colombianos
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  /**
   * Maneja el error de carga de imagen
   */
  onImageError(): void {
    this.imageError = true;
  }

  /**
   * Incrementa la cantidad
   */
  incrementQuantity(): void {
    const currentQuantity = this.quantityForm.get('quantity')?.value || 1;
    const maxQuantity = this.getAvailableQuantity();
    
    if (currentQuantity < maxQuantity) {
      this.quantityForm.patchValue({ quantity: currentQuantity + 1 });
    }
  }

  /**
   * Decrementa la cantidad
   */
  decrementQuantity(): void {
    const currentQuantity = this.quantityForm.get('quantity')?.value || 1;
    
    if (currentQuantity > 1) {
      this.quantityForm.patchValue({ quantity: currentQuantity - 1 });
    }
  }

  /**
   * Agrega el producto al carrito
   */
  addToCart(): void {
    if (this.quantityForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    const quantity = this.quantityForm.get('quantity')?.value || 1;
    
    try {
      const result = this.cartService.addToCart(this.product, { quantity });
      
      if (result.success) {
        this.snackBar.open(
          `"${this.getProductName()}" agregado al carrito`,
          'Ver carrito',
          { duration: 3000 }
        ).onAction().subscribe(() => {
          // Navigate back after adding to cart
          this.router.navigate(['/cart']);
        });

        // Mostrar animación de éxito
        this.showSuccessAnimation();
      } else {
        this.snackBar.open(
          result.message || 'Error al agregar al carrito',
          'Cerrar',
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      this.snackBar.open(
        'Error inesperado al agregar al carrito',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  /**
   * Compra directa (agrega al carrito y va a checkout)
   */
  buyNow(): void {
    if (this.quantityForm.invalid) {
      this.markFormAsTouched();
      return;
    }

    const quantity = this.quantityForm.get('quantity')?.value || 1;
    
    try {
      const result = this.cartService.addToCart(this.product, { quantity });
      
      if (result.success) {
        // Navigate to checkout
        this.router.navigate(['/checkout']);
      } else {
        this.snackBar.open(
          result.message || 'Error al procesar la compra',
          'Cerrar',
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Error al procesar compra:', error);
      this.snackBar.open(
        'Error inesperado al procesar la compra',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  /**
   * Edita el producto (si tiene permisos)
   */
  editProduct(): void {
    if (!this.canEdit) return;
    
    this.router.navigate(['/products/edit', this.getProductId()]);
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.router.navigate(['/']);
  }

  /**
   * Verifica si un campo es inválido
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.quantityForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error de un campo
   */
  getFieldError(fieldName: string): string {
    const field = this.quantityForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    
    if (errors['required']) return 'Campo requerido';
    if (errors['min']) return 'Cantidad mínima: 1';
    if (errors['max']) return `Cantidad máxima: ${errors['max'].max}`;
    
    return 'Campo inválido';
  }

  /**
   * Marca el formulario como tocado
   * 
   * @private
   */
  private markFormAsTouched(): void {
    Object.keys(this.quantityForm.controls).forEach(key => {
      const control = this.quantityForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Muestra animación de éxito
   * 
   * @private
   */
  private showSuccessAnimation(): void {
    // TODO: Implementar animación de fly-to-cart
    // Por ahora solo cerramos el modal después de un delay
    setTimeout(() => {
      // Navigate back after adding to cart
    }, 1000);
  }

  /**
   * Obtiene el stock restante formateado
   */
  get stockText(): string {
    const available = this.getAvailableQuantity();
    if (available <= 0) return 'Sin stock';
    if (available <= 5) return `¡Solo quedan ${available}!`;
    return `${available} disponibles`;
  }

  /**
   * Verifica si el producto está disponible
   */
  get isAvailable(): boolean {
    return this.getAvailableQuantity() > 0;
  }
}
