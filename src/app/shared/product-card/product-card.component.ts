import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  imageError = false;

  get discountedPrice(): number {
    if (this.product.discountPercent) {
      return this.product.price * (1 - this.product.discountPercent / 100);
    }
    return this.product.price;
  }

  get hasDiscount(): boolean {
    return !!this.product.discountPercent && this.product.discountPercent > 0;
  }

  onImageError(event: any): void {
    this.imageError = true;
    event.target.style.display = 'none';
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
