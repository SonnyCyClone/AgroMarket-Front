import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ProductApiService } from '../../core/services/product/product.api';
import { Categoria } from '../../core/models/categoria.model';
import { TipoProducto } from '../../core/models/tipo-producto.model';
import { Unidad } from '../../core/models/unidad.model';
import { CreateProductRequest } from '../../core/models/producto.create';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-register-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './register-product.page.html',
  styleUrl: './register-product.page.css'
})
export class RegisterProductPage implements OnInit {
  productForm!: FormGroup;
  categorias: Categoria[] = [];
  tiposProducto: TipoProducto[] = [];
  unidades: Unidad[] = [];
  
  isLoading = true;
  isSubmitting = false;
  showConfirmDialog = false;
  errorMessage = '';
  showError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productApiService: ProductApiService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      variedad: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      cantidadDisponible: [1, [Validators.required, Validators.min(1)]],
      unidadesId: [null, [Validators.required]],
      categoriaId: [null, [Validators.required]],
      idTipoProducto: [null, [Validators.required]],
      imagenUrl: ['', [Validators.required]],
      activo: [true]
    });

    // Watch for category changes to load product types
    this.productForm.get('categoriaId')?.valueChanges.subscribe(categoriaId => {
      if (categoriaId) {
        this.loadTiposProducto(categoriaId);
      } else {
        this.tiposProducto = [];
        this.productForm.get('idTipoProducto')?.setValue(null);
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
        this.categorias = data.categorias.filter(c => c.activo);
        this.unidades = data.unidades.filter(u => u.activo);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
        this.errorMessage = 'Error al cargar datos iniciales. Por favor, intenta de nuevo.';
        this.showError = true;
        this.isLoading = false;
      }
    });
  }

  private loadTiposProducto(categoriaId: number): void {
    this.productApiService.listTiposByCategoria(categoriaId).subscribe({
      next: (tipos) => {
        this.tiposProducto = tipos;
        this.productForm.get('idTipoProducto')?.setValue(null);
      },
      error: (error) => {
        console.error('Error loading product types:', error);
        this.tiposProducto = [];
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.productForm.value;
      const request: CreateProductRequest = {
        Variedad: formValue.variedad,
        Descripcion: formValue.descripcion,
        Precio: formValue.precio,
        CantidadDisponible: formValue.cantidadDisponible,
        UnidadesId: formValue.unidadesId,
        IdTipoProducto: formValue.idTipoProducto,
        ImagenUrl: formValue.imagenUrl,
        Activo: formValue.activo
      };

      this.productApiService.createProduct(request).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.isSubmitting = false;
          this.showConfirmDialog = true;
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Error al registrar el producto. Por favor, intenta de nuevo.';
          this.showError = true;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  onConfirmDialogClose(): void {
    this.showConfirmDialog = false;
    this.router.navigate(['/']);
  }

  onErrorDialogClose(): void {
    this.showError = false;
  }

  getFieldError(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (control.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['min']) return `${this.getFieldLabel(fieldName)} debe ser mayor a ${control.errors['min'].min}`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: {[key: string]: string} = {
      'variedad': 'Variedad',
      'descripcion': 'Descripción',
      'precio': 'Precio',
      'cantidadDisponible': 'Cantidad disponible',
      'unidadesId': 'Unidad',
      'categoriaId': 'Categoría',
      'idTipoProducto': 'Tipo de producto',
      'imagenUrl': 'URL de imagen'
    };
    return labels[fieldName] || fieldName;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
}
