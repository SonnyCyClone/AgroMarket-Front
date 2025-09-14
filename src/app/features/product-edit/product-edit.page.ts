/**
 * Página de edición de productos para AgroMarket
 * 
 * @description Página completa para editar productos con todos
 * los campos del contrato PUT API, diseño por secciones, carga de catálogos
 * y funcionalidad completa de imagen.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Product } from "../../core/models/product.model";
import { environment } from "../../../environments/environment";

/**
 * Interfaz para Unidades de medida
 */
interface Unidad {
  id: number;
  nombre: string;
  abreviatura: string;
  activo: boolean;
}

/**
 * Interfaz para Tipo de Producto
 */
interface TipoProducto {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  categoriaId: number;
}

/**
 * Interfaz para Categoría
 */
interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

/**
 * Página para editar productos
 * 
 * @description Proporciona un formulario completo para editar productos con
 * todos los campos del contrato PUT API, incluyendo carga de catálogos,
 * manejo de imágenes y validación completa.
 */
@Component({
  selector: "app-product-edit",
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: "./product-edit.page.html",
  styleUrl: "./product-edit.page.css"
})
export class ProductEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /**
   * ID del producto a editar
   */
  productId = signal<number | null>(null);

  /**
   * Producto cargado
   */
  product = signal<Product | null>(null);

  /**
   * Estado de carga
   */
  isLoading = signal(false);
  isSubmitting = signal(false);

  /**
   * Formulario reactivo para edición del producto
   */
  editForm!: FormGroup;

  /**
   * Lista de unidades disponibles
   */
  unidades = signal<Unidad[]>([]);

  /**
   * Lista de categorías disponibles
   */
  categorias = signal<Categoria[]>([]);

  /**
   * Lista de tipos de producto filtrados por categoría
   */
  tiposProducto = signal<TipoProducto[]>([]);

  /**
   * Categoría seleccionada para filtrar tipos de producto
   */
  selectedCategoriaId = signal<number | null>(null);

  /**
   * Preview de la imagen seleccionada
   */
  imagePreview = signal<string>('');

  /**
   * Archivo de imagen seleccionado
   */
  selectedImageFile = signal<File | null>(null);

  /**
   * Mensajes de estado
   */
  showMessage = signal('');
  showError = signal('');

  /**
   * URLs base para APIs
   */
  private readonly API_BASE_PRODUCT = environment.apiBaseUrlProduct || 'https://az-agromarket-back-product.azurewebsites.net';

  async ngOnInit() {
    // Obtener ID del producto de la ruta
    this.route.params.subscribe(params => {
      const id = parseInt(params['id']);
      if (id) {
        this.productId.set(id);
        this.loadProduct(id);
      } else {
        this.router.navigate(['/products/manage']);
      }
    });

    await this.loadCatalogData();
  }

  /**
   * Carga el producto a editar
   */
  private async loadProduct(productId: number) {
    try {
      this.isLoading.set(true);
      
      const product = await firstValueFrom(
        this.http.get<Product>(`${this.API_BASE_PRODUCT}/api/Producto/${productId}`)
      );
      
      this.product.set(product);
      this.initializeForm();
      
    } catch (error) {
      console.error('Error cargando producto:', error);
      this.showError.set('Error al cargar el producto. Verifica que existe.');
      setTimeout(() => {
        this.router.navigate(['/products/manage']);
      }, 3000);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Inicializa el formulario con todos los campos del contrato PUT API
   */
  private initializeForm() {
    const productData = this.product();
    
    this.editForm = this.fb.group({
      id: [productData?.id || 0],
      variedad: [
        productData?.variedad || '',
        [Validators.required, Validators.maxLength(100)]
      ],
      descripcion: [
        productData?.descripcion || '',
        [Validators.required, Validators.maxLength(500)]
      ],
      precio: [
        productData?.precio || 0,
        [Validators.required, Validators.min(0)]
      ],
      cantidadDisponible: [
        productData?.cantidadDisponible || 0,
        [Validators.required, Validators.min(0)]
      ],
      unidadesId: [
        productData?.unidadesId || null,
        [Validators.required]
      ],
      idTipoProducto: [
        productData?.idTipoProducto || null,
        [Validators.required]
      ],
      imagenUrl: [productData?.imagenUrl || ''],
      activo: [productData?.activo !== false]
    });

    // Configurar preview de imagen existente
    if (productData?.imagenUrl) {
      this.imagePreview.set(productData.imagenUrl);
    }

    // Cargar la categoría del tipo de producto si existe
    if (productData?.idTipoProducto) {
      this.loadTipoProductoCategory();
    }
  }

  /**
   * Carga datos de catálogos necesarios
   */
  private async loadCatalogData() {
    try {
      // Cargar unidades y categorías en paralelo
      const [unidadesResponse, categoriasResponse] = await Promise.all([
        firstValueFrom(this.http.get<Unidad[]>(`${this.API_BASE_PRODUCT}/api/Uniodades`)),
        firstValueFrom(this.http.get<Categoria[]>(`${this.API_BASE_PRODUCT}/api/Categoria`))
      ]);

      this.unidades.set(unidadesResponse || []);
      this.categorias.set(categoriasResponse || []);

    } catch (error) {
      console.error('Error cargando datos de catálogo:', error);
      this.showError.set('Error cargando catálogos. Algunos campos podrían no funcionar correctamente.');
    }
  }

  /**
   * Carga la categoría del tipo de producto actual
   */
  private async loadTipoProductoCategory() {
    const categorias = this.categorias();
    const productData = this.product();
    
    if (!productData?.idTipoProducto) return;

    for (const categoria of categorias) {
      try {
        const tipos = await firstValueFrom(
          this.http.get<TipoProducto[]>(`${this.API_BASE_PRODUCT}/api/TipoProducto/Categoria/${categoria.id}`)
        );
        
        const tipoActual = tipos?.find(t => t.id === productData.idTipoProducto);
        if (tipoActual) {
          this.selectedCategoriaId.set(categoria.id);
          this.tiposProducto.set(tipos || []);
          break;
        }
      } catch (error) {
        console.error(`Error cargando tipos de producto para categoría ${categoria.id}:`, error);
      }
    }
  }

  /**
   * Maneja el cambio de categoría para cargar tipos de producto
   */
  async onCategoriaChange(categoriaId: number) {
    this.selectedCategoriaId.set(categoriaId);
    this.tiposProducto.set([]);
    this.editForm.patchValue({ idTipoProducto: null });

    if (categoriaId) {
      try {
        const tipos = await firstValueFrom(
          this.http.get<TipoProducto[]>(`${this.API_BASE_PRODUCT}/api/TipoProducto/Categoria/${categoriaId}`)
        );
        this.tiposProducto.set(tipos || []);
      } catch (error) {
        console.error('Error cargando tipos de producto:', error);
        this.showError.set('Error cargando tipos de producto para la categoría seleccionada.');
      }
    }
  }

  /**
   * Maneja la selección de archivos de imagen
   */
  onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        this.showError.set('La imagen no puede ser mayor a 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        this.showError.set('Solo se permiten archivos de imagen');
        return;
      }

      this.selectedImageFile.set(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Remueve la imagen seleccionada
   */
  removeImage() {
    this.selectedImageFile.set(null);
    this.imagePreview.set('');
    this.editForm.patchValue({ imagenUrl: '' });
    
    // Limpiar el input file
    const fileInput = document.getElementById('image-upload-edit') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Verifica si un campo tiene errores
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    
    if (errors['required']) return `Este campo es obligatorio`;
    if (errors['maxlength']) return `Excede el límite de ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['min']) return `El valor debe ser mayor o igual a ${errors['min'].min}`;
    
    return 'Valor inválido';
  }

  /**
   * Maneja el envío del formulario
   */
  async onSubmit() {
    if (this.editForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.showError.set('');
      
      try {
        const formData = new FormData();
        const formValues = this.editForm.value;

        // Agregar campos según contrato PUT API exacto del sample
        formData.append('Id', formValues.id.toString());
        formData.append('Variedad', formValues.variedad);
        formData.append('Descripcion', formValues.descripcion);
        formData.append('Precio', formValues.precio.toString());
        formData.append('CantidadDisponible', formValues.cantidadDisponible.toString());
        formData.append('UnidadesId', formValues.unidadesId.toString());
        formData.append('IdTipoProducto', formValues.idTipoProducto.toString());
        formData.append('Activo', formValues.activo.toString());

        // Manejar imagen según el sample API
        if (this.selectedImageFile()) {
          formData.append('Imagen', this.selectedImageFile()!);
        } else {
          // Si no hay imagen nueva, enviar ImagenUrl como undefined para mantener la actual
          formData.append('ImagenUrl', 'undefined');
        }

        // Realizar llamada PUT al API
        await firstValueFrom(this.http.put(`${this.API_BASE_PRODUCT}/api/Producto`, formData));

        this.showMessage.set('¡Producto actualizado exitosamente!');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/products/manage']);
        }, 2000);

      } catch (error: any) {
        console.error('Error actualizando producto:', error);
        
        let mensaje = 'Error al actualizar el producto. ';
        if (error.error?.message) {
          mensaje += error.error.message;
        } else if (error.message) {
          mensaje += error.message;
        } else {
          mensaje += 'Por favor, verifica los datos e intenta nuevamente.';
        }
        
        this.showError.set(mensaje);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.markFormGroupTouched();
    }
  }

  /**
   * Marca todos los campos del formulario como tocados
   */
  private markFormGroupTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      this.editForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Navega de vuelta a la lista de productos
   */
  goBack() {
    this.router.navigate(['/products/manage']);
  }
}