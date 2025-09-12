import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ProductApiService } from '../../core/services/product/product.api';
import { Categoria } from '../../core/models/categoria.model';
import { TipoProducto } from '../../core/models/tipo-producto.model';
import { Unidad } from '../../core/models/unidad.model';
import { CreateProductRequest } from '../../core/models/producto.create';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-register-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-product.page.html',
  styleUrl: './register-product.page.css'
})
export class RegisterProductPage implements OnInit {
  productForm!: FormGroup;
  categorias: Categoria[] = [];
  tiposProducto: TipoProducto[] = [];
  unidades: Unidad[] = [];
  
  isLoading = false;
  isLoadingTipos = false;
  isSubmitting = false;
  
  showSuccessMessage = false;
  showErrorMessage = false;
  successMessage = '';
  errorMessage = '';
  
  imagePreviewUrl: string | null = null;
  selectedImageFile: File | null = null;

  monedas = [
    { codigo: 'COP', nombre: 'Peso Colombiano', simbolo: '$' },
    { codigo: 'USD', nombre: 'Dólar Americano', simbolo: 'US$' },
    { codigo: 'EUR', nombre: 'Euro', simbolo: '€' }
  ];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private productApiService: ProductApiService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      variedad: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      moneda: ['COP', Validators.required],
      cantidadDisponible: [1, [Validators.required, Validators.min(1)]],
      unidadesId: [null, Validators.required],
      categoriaId: [null, Validators.required],
      idTipoProducto: [null, Validators.required],
      imagenUrl: [''],
      activo: [true]
    });

    // Escuchar cambios en la categoría para cargar tipos de producto
    this.productForm.get('categoriaId')?.valueChanges.subscribe(categoriaId => {
      if (categoriaId) {
        this.loadTiposProducto(categoriaId);
      } else {
        this.tiposProducto = [];
        this.productForm.patchValue({ idTipoProducto: null });
      }
    });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    
    forkJoin({
      categorias: this.productApiService.listCategorias(),
      unidades: this.productApiService.listUnidades()
    }).subscribe({
      next: (data) => {
        // Filtrar solo categorías activas
        this.categorias = data.categorias.filter((cat: Categoria) => cat.activo);
        // Filtrar solo unidades activas
        this.unidades = data.unidades.filter((unidad: Unidad) => unidad.activo);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error cargando datos iniciales:', error);
        this.showError('Error cargando los datos iniciales. Por favor, recarga la página.');
        this.isLoading = false;
      }
    });
  }

  private loadTiposProducto(categoriaId: number): void {
    this.isLoadingTipos = true;
    this.productForm.patchValue({ idTipoProducto: null });
    
    this.productApiService.listTiposByCategoria(categoriaId).subscribe({
      next: (tipos: TipoProducto[]) => {
        // Filtrar solo tipos activos
        this.tiposProducto = tipos.filter((tipo: TipoProducto) => tipo.activo);
        this.isLoadingTipos = false;
      },
      error: (error: any) => {
        console.error('Error cargando tipos de producto:', error);
        this.showError('Error cargando los tipos de producto.');
        this.tiposProducto = [];
        this.isLoadingTipos = false;
      }
    });
  }

  formatUnidadOption(unidad: Unidad): string {
    return `${unidad.abreviatura} - ${unidad.nombre}`;
  }

  formatPrice(precio: number): string {
    if (!precio || precio <= 0) return '';
    
    const monedaSeleccionada = this.productForm.get('moneda')?.value || 'COP';
    const moneda = this.monedas.find(m => m.codigo === monedaSeleccionada);
    const simbolo = moneda?.simbolo || '$';
    
    return `${simbolo} ${precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.processSelectedFile(file);
    }
  }

  removeImage(): void {
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
    this.productForm.patchValue({ imagenUrl: '' });
    
    // Limpiar el input file
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onImageRemoved(): void {
    this.removeImage();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onImageDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.processSelectedFile(file);
    }
  }

  private processSelectedFile(file: File): void {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.showError('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      this.showError('La imagen debe ser menor a 5MB.');
      return;
    }
    
    this.selectedImageFile = file;
    
    // Crear vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreviewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      try {
        const formValues = this.productForm.value;
        
        // Crear FormData para envío con imagen
        const formData = new FormData();
        formData.append('Variedad', formValues.variedad);
        formData.append('Descripcion', formValues.descripcion);
        formData.append('Precio', formValues.precio.toString());
        formData.append('CantidadDisponible', formValues.cantidadDisponible.toString());
        formData.append('UnidadesId', formValues.unidadesId.toString());
        formData.append('IdTipoProducto', formValues.idTipoProducto.toString());
        formData.append('Activo', formValues.activo.toString());
        
        // Agregar imagen si existe (el campo debe coincidir con lo que espera el backend)
        if (this.selectedImageFile) {
          formData.append('ImagenUrl', this.selectedImageFile, this.selectedImageFile.name);
          console.log('Image file attached:', this.selectedImageFile.name, 'Size:', this.selectedImageFile.size);
        } else {
          formData.append('ImagenUrl', '');
          console.log('No image file selected');
        }
        
        // Debug: mostrar el contenido del FormData
        console.log('FormData contents:');
        for (const [key, value] of formData.entries()) {
          console.log(key, ':', value);
        }
        
        // Llamada directa a la API usando HttpClient
        const url = `${environment.apiBaseUrlProduct}/api/Producto`;
        console.log('Sending request to:', url);
        const response = await firstValueFrom(this.http.post(url, formData));
        
        this.showSuccess('¡Producto registrado exitosamente!');
        this.resetForm();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/products/manage']);
        }, 2000);
        
      } catch (error: any) {
        console.error('Error creando producto:', error);
        
        let mensaje = 'Error al registrar el producto. ';
        if (error.error?.message) {
          mensaje += error.error.message;
        } else if (error.message) {
          mensaje += error.message;
        } else {
          mensaje += 'Por favor, verifica los datos e intenta nuevamente.';
        }
        
        this.showError(mensaje);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private resetForm(): void {
    this.productForm.reset({
      variedad: '',
      descripcion: '',
      precio: 0,
      moneda: 'COP',
      cantidadDisponible: 1,
      unidadesId: null,
      categoriaId: null,
      idTipoProducto: null,
      imagenUrl: '',
      activo: true
    });
    
    this.removeImage();
    this.tiposProducto = [];
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.productForm.get(fieldName);
    
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return 'Este campo es obligatorio';
      }
      if (field.errors?.['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `Máximo ${maxLength} caracteres`;
      }
      if (field.errors?.['min']) {
        const min = field.errors['min'].min;
        return `El valor mínimo es ${min}`;
      }
      if (field.errors?.['email']) {
        return 'Formato de email inválido';
      }
    }
    
    return null;
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessMessage = true;
    this.showErrorMessage = false;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.dismissSuccessMessage();
    }, 5000);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.showErrorMessage = true;
    this.showSuccessMessage = false;
    
    // Auto-ocultar después de 8 segundos
    setTimeout(() => {
      this.dismissErrorMessage();
    }, 8000);
  }

  dismissSuccessMessage(): void {
    this.showSuccessMessage = false;
    this.successMessage = '';
  }

  dismissErrorMessage(): void {
    this.showErrorMessage = false;
    this.errorMessage = '';
  }

  onCancel(): void {
    if (this.productForm.dirty) {
      const confirmLeave = confirm('¿Estás seguro que deseas cancelar? Se perderán todos los cambios no guardados.');
      if (confirmLeave) {
        this.router.navigate(['/products/manage']);
      }
    } else {
      this.router.navigate(['/products/manage']);
    }
  }

  /**
   * Abre popup para agregar nueva categoría
   */
  openCategoryModal(): void {
    // TODO: Implementar modal para crear nueva categoría
    console.log('Abriendo modal para crear categoría');
  }

  /**
   * Abre popup para agregar nuevo tipo de producto
   */
  openTipoProductoModal(): void {
    // TODO: Implementar modal para crear nuevo tipo de producto
    console.log('Abriendo modal para crear tipo de producto');
  }

  /**
   * Obtiene el nombre de la categoría seleccionada
   */
  get selectedCategoryName(): string {
    const selectedId = this.productForm.get('idCategoria')?.value;
    const category = this.categorias.find(cat => cat.id === selectedId);
    return category ? category.nombre : '';
  }
}
