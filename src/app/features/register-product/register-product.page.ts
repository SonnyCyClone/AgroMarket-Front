import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product/product.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-register-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './register-product.page.html',
  styleUrl: './register-product.page.css'
})
export class RegisterProductPage {
  productData = {
    name: '',
    category: '',
    brand: '',
    price: 0,
    discountPercent: 0,
    imageUrl: '',
    description: ''
  };

  categories = [
    'Herramientas',
    'Semillas',
    'Fertilizantes',
    'Estructuras',
    'Riego',
    'Iluminación',
    'Mobiliario',
    'Sistemas',
    'Monitoreo'
  ];

  showSuccessDialog = false;
  isSubmitting = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;

    // Simulate async operation
    setTimeout(() => {
      try {
        this.productService.create(this.productData);
        this.showSuccessDialog = true;
      } catch (error) {
        console.error('Error creating product:', error);
        // In a real app, you'd show an error message here
      } finally {
        this.isSubmitting = false;
      }
    }, 500);
  }

  onSuccessConfirm(): void {
    this.showSuccessDialog = false;
    this.router.navigate(['/']);
  }

  isFormValid(): boolean {
    return !!(
      this.productData.name.trim() &&
      this.productData.category &&
      this.productData.brand.trim() &&
      this.productData.price > 0 &&
      this.productData.imageUrl.trim() &&
      this.productData.description.trim()
    );
  }

  resetForm(): void {
    this.productData = {
      name: '',
      category: '',
      brand: '',
      price: 0,
      discountPercent: 0,
      imageUrl: '',
      description: ''
    };
  }
}
