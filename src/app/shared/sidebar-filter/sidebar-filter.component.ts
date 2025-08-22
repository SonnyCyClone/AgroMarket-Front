import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-filter.component.html',
  styleUrl: './sidebar-filter.component.css'
})
export class SidebarFilterComponent {
  categories = [
    'Todas las Categorías',
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

  brands = [
    'Todas las Marcas',
    'GardenPro',
    'EcoGrow',
    'GrowSpace',
    'AquaFlow',
    'ComfortGarden',
    'NatureFeed',
    'GrowLux',
    'FarmStrong',
    'HydroGrow',
    'WeatherTech'
  ];

  priceRanges = [
    'Todos los Precios',
    'Menos de $100.000',
    '$100.000 - $300.000',
    '$300.000 - $500.000',
    '$500.000 - $1.000.000',
    '$1.000.000 - $2.000.000',
    'Más de $2.000.000'
  ];

  selectedCategory = 'Todas las Categorías';
  selectedBrand = 'Todas las Marcas';
  selectedPriceRange = 'Todos los Precios';

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    // TODO: Implement filtering
  }

  onBrandChange(brand: string): void {
    this.selectedBrand = brand;
    // TODO: Implement filtering
  }

  onPriceRangeChange(priceRange: string): void {
    this.selectedPriceRange = priceRange;
    // TODO: Implement filtering
  }

  clearFilters(): void {
    this.selectedCategory = 'Todas las Categorías';
    this.selectedBrand = 'Todas las Marcas';
    this.selectedPriceRange = 'Todos los Precios';
    // TODO: Implement filter clearing
  }
}
