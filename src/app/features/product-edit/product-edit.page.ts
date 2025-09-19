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
import { ToastService } from "../../core/services/toast/toast.service";

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
  private toastService = inject(ToastService);

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
   * Archivo de imagen seleccionado
   */
  selectedImageFile = signal<File | null>(null);

  /**
   * URL de imagen actual (antes de cambios)
   */
  currentImageUrl = signal<string>('');

  /**
   * Preview de la imagen seleccionada o actual
   */
  imagePreview = signal<string>('');

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
      this.toastService.error('Error al cargar el producto. Verifica que existe.', 'Error de Carga');
      setTimeout(() => {
        this.router.navigate(['/products/manage']);
      }, 2000);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Inicializa el formulario con todos los campos del contrato PUT API
   */
  private initializeForm() {
    const productData = this.product();
    const currentProductId = this.productId() || productData?.id || 0;
    
    this.editForm = this.fb.group({
      id: [currentProductId],
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

    // Configurar imagen actual y preview
    if (productData?.imagenUrl) {
      this.currentImageUrl.set(productData.imagenUrl);
      this.imagePreview.set(productData.imagenUrl);
    }

    // Resetear imagen seleccionada al inicializar
    this.selectedImageFile.set(null);

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
    
    if (!file) {
      return;
    }

    // Limpiar errores previos
    this.showError.set('');

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.toastService.error('Formato de imagen no permitido. Use JPG, PNG, GIF o WEBP.', 'Error de Archivo');
      this.clearImageInput();
      return;
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.toastService.error('La imagen supera el tamaño máximo de 5 MB.', 'Archivo Muy Grande');
      this.clearImageInput();
      return;
    }

    // Guardar archivo seleccionado
    this.selectedImageFile.set(file);
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.onerror = () => {
      this.toastService.error('Error al leer el archivo de imagen.', 'Error de Lectura');
      this.clearImageInput();
    };
    reader.readAsDataURL(file);
  }

  /**
   * Limpia el input de archivo y resetea referencias
   */
  private clearImageInput() {
    const fileInput = document.getElementById('image-upload-edit') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.selectedImageFile.set(null);
  }

  /**
   * Remueve la imagen seleccionada y restaura la imagen actual
   */
  removeImage() {
    this.selectedImageFile.set(null);
    this.clearImageInput();
    
    // Restaurar imagen actual o limpiar preview si no había imagen
    const currentUrl = this.currentImageUrl();
    if (currentUrl) {
      this.imagePreview.set(currentUrl);
    } else {
      this.imagePreview.set('');
      this.editForm.patchValue({ imagenUrl: '' });
    }
  }

  /**
   * Restaura la imagen original (cancela cambios de imagen)
   */
  restoreOriginalImage() {
    this.selectedImageFile.set(null);
    this.clearImageInput();
    
    const currentUrl = this.currentImageUrl();
    if (currentUrl) {
      this.imagePreview.set(currentUrl);
    } else {
      this.imagePreview.set('');
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
        const expectedId = this.productId();

        // Validar que el ID del formulario coincida con el ID de la ruta
        if (!expectedId || formValues.id !== expectedId) {
          throw new Error(`Error de validación: ID del producto no coincide. Esperado: ${expectedId}, Formulario: ${formValues.id}`);
        }

        // Agregar campos según contrato PUT API exacto (nombres exactos del backend)
        formData.append('Id', formValues.id.toString());
        formData.append('Variedad', formValues.variedad || '');
        formData.append('Descripcion', formValues.descripcion || '');
        formData.append('Precio', formValues.precio?.toString() || '0');
        formData.append('CantidadDisponible', formValues.cantidadDisponible?.toString() || '0');
        formData.append('UnidadesId', formValues.unidadesId?.toString() || '');
        formData.append('IdTipoProducto', formValues.idTipoProducto?.toString() || '');
        formData.append('Activo', formValues.activo ? 'true' : 'false');

        // Manejar imagen según especificación del backend
        const selectedFile = this.selectedImageFile();
        if (selectedFile) {
          // Usuario seleccionó nueva imagen - enviar archivo
          formData.append('ImagenUrl', selectedFile, selectedFile.name);
        } else {
          // No cambió imagen - mantener la actual si existe
          const currentUrl = this.currentImageUrl();
          if (currentUrl) {
            // Solo enviar URL si el backend lo requiere explícitamente
            // Si no, omitir el campo para mantener imagen actual
            // formData.append('ImagenUrl', currentUrl);
          }
        }

        // Realizar llamada PUT al API (sin Content-Type manual)
        await firstValueFrom(this.http.put(`${this.API_BASE_PRODUCT}/api/Producto`, formData));

        this.toastService.success('Imagen y producto actualizados correctamente.', 'Actualización Exitosa');
        
        // Actualizar estado después del éxito
        if (selectedFile) {
          // Si se subió nueva imagen, actualizar la URL actual con el preview
          this.currentImageUrl.set(this.imagePreview());
          this.selectedImageFile.set(null);
          this.clearImageInput();
        }
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          this.router.navigate(['/products/manage']);
        }, 1500);

      } catch (error: any) {
        console.error('Error actualizando producto:', error);
        
        let mensaje = 'No se pudo actualizar el producto. Intenta nuevamente.';
        if (error.error?.message) {
          mensaje = error.error.message;
        } else if (error.message && !error.message.includes('ID del producto no coincide')) {
          mensaje = error.message;
        }
        
        this.toastService.error(mensaje, 'Error de Actualización');
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.markFormGroupTouched();
      this.toastService.error('Completa los campos obligatorios.', 'Formulario Incompleto');
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