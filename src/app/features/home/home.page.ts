import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarFilterComponent } from '../../shared/sidebar-filter/sidebar-filter.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { ProductService } from '../../core/services/product/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarFilterComponent, ProductCardComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage implements OnInit {
  products: Product[] = [];
  sortOption = 'name';

  sortOptions = [
    { value: 'name', label: 'Nombre A-Z' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'newest', label: 'Más Recientes' }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products = this.productService.list();
  }

  onSortChange(event: any): void {
    this.sortOption = event.target.value;
    // TODO: Implement sorting
    console.log('Sort changed to:', this.sortOption);
  }
}
