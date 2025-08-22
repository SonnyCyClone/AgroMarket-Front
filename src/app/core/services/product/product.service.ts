import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly storageKey = 'agromarket_products';
  private products: Product[] = [];

  constructor() {
    this.loadFromStorage();
    this.seedIfEmpty();
  }

  list(): Product[] {
    return [...this.products];
  }

  create(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    this.saveToStorage();
    return newProduct;
  }

  seedIfEmpty(): void {
    if (this.products.length === 0) {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Azada Profesional para Jardín',
          category: 'Herramientas',
          brand: 'GardenPro',
          price: 185000,
          discountPercent: 15,
          imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop',
          description: 'Azada resistente para agricultura profesional y jardinería',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Semillas de Tomate Orgánico',
          category: 'Semillas',
          brand: 'EcoGrow',
          price: 50000,
          imageUrl: 'https://broken-image-url-that-will-fail.com/tomato-seeds.jpg',
          description: 'Semillas orgánicas de tomate premium para alto rendimiento',
          createdAt: '2024-01-16T10:00:00Z'
        },
        {
          id: '3',
          name: 'Kit Invernadero 10x12',
          category: 'Estructuras',
          brand: 'GrowSpace',
          price: 3600000,
          discountPercent: 25,
          imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
          description: 'Kit completo de invernadero con estructura de aluminio',
          createdAt: '2024-01-17T10:00:00Z'
        },
        {
          id: '4',
          name: 'Sistema de Riego Profesional',
          category: 'Riego',
          brand: 'AquaFlow',
          price: 940000,
          imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=300&fit=crop',
          description: 'Sistema de riego automatizado para jardines grandes',
          createdAt: '2024-01-18T10:00:00Z'
        },
        {
          id: '5',
          name: 'Silla Ergonómica de Jardín',
          category: 'Mobiliario',
          brand: 'ComfortGarden',
          price: 315000,
          discountPercent: 10,
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
          description: 'Silla resistente al clima con diseño ergonómico para jardín',
          createdAt: '2024-01-19T10:00:00Z'
        },
        {
          id: '6',
          name: 'Fertilizante Orgánico 25kg',
          category: 'Fertilizantes',
          brand: 'NatureFeed',
          price: 222000,
          imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=300&fit=crop',
          description: 'Fertilizante orgánico premium para todos los cultivos',
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          id: '7',
          name: 'Sistema de Luces LED de Crecimiento',
          category: 'Iluminación',
          brand: 'GrowLux',
          price: 760000,
          discountPercent: 20,
          imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
          description: 'Luces LED de espectro completo para agricultura indoor',
          createdAt: '2024-01-21T10:00:00Z'
        },
        {
          id: '8',
          name: 'Carretilla Industrial Reforzada',
          category: 'Herramientas',
          brand: 'FarmStrong',
          price: 502000,
          imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=300&fit=crop',
          description: 'Carretilla de grado industrial para cargas pesadas',
          createdAt: '2024-01-22T10:00:00Z'
        },
        {
          id: '9',
          name: 'Kit Hidropónico Principiantes',
          category: 'Sistemas',
          brand: 'HydroGrow',
          price: 1200000,
          discountPercent: 30,
          imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
          description: 'Sistema hidropónico completo para principiantes',
          createdAt: '2024-01-23T10:00:00Z'
        },
        {
          id: '10',
          name: 'Estación Meteorológica Profesional',
          category: 'Monitoreo',
          brand: 'WeatherTech',
          price: 1780000,
          imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=300&fit=crop',
          description: 'Sistema profesional de monitoreo climático',
          createdAt: '2024-01-24T10:00:00Z'
        }
      ];

      this.products = mockProducts;
      this.saveToStorage();
    }
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.products = JSON.parse(stored);
      } catch (error) {
        this.products = [];
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.products));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
