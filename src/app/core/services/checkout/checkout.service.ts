/**
 * Servicio de checkout para AgroMarket
 * 
 * @description Servicio para manejar el estado del proceso de checkout,
 * incluyendo datos de envío, información de pago y persistencia de datos.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable, signal, computed } from '@angular/core';

/**
 * Interfaz para el método de envío
 */
export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated: string;
}

/**
 * Interfaz para los datos de envío
 */
export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shippingMethod: string;
  specialInstructions?: string;
}

/**
 * Servicio para manejar el checkout
 */
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly SHIPPING_KEY = 'agromarket_checkout_shipping';

  /** Métodos de envío disponibles */
  private readonly shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Envío Estándar',
      description: '3-5 días hábiles',
      price: 15000,
      estimated: '3-5 días'
    },
    {
      id: 'express',
      name: 'Envío Express',
      description: '1-2 días hábiles',
      price: 25000,
      estimated: '1-2 días'
    }
  ];

  /** Signal para los datos de envío */
  private shippingData = signal<ShippingData | null>(null);

  /** Signal para el método de envío seleccionado */
  private selectedShippingMethod = signal<ShippingMethod | null>(null);

  /** Computed para el precio de envío actual */
  public currentShippingPrice = computed(() => {
    const method = this.selectedShippingMethod();
    return method ? method.price : 0;
  });

  /** Computed para el nombre del método de envío actual */
  public currentShippingMethodName = computed(() => {
    const method = this.selectedShippingMethod();
    return method ? method.name : '';
  });

  constructor() {
    this.loadShippingDataFromStorage();
  }

  /**
   * Obtiene todos los métodos de envío disponibles
   */
  getShippingMethods(): ShippingMethod[] {
    return [...this.shippingMethods];
  }

  /**
   * Obtiene un método de envío por ID
   */
  getShippingMethodById(id: string): ShippingMethod | null {
    return this.shippingMethods.find(method => method.id === id) || null;
  }

  /**
   * Establece los datos de envío
   */
  setShippingData(data: ShippingData): void {
    this.shippingData.set(data);
    
    // Actualizar el método de envío seleccionado
    const method = this.getShippingMethodById(data.shippingMethod);
    this.selectedShippingMethod.set(method);
    
    // Persistir en localStorage
    this.saveShippingDataToStorage(data);
  }

  /**
   * Obtiene los datos de envío actuales
   */
  getShippingData(): ShippingData | null {
    return this.shippingData();
  }

  /**
   * Obtiene el método de envío seleccionado
   */
  getSelectedShippingMethod(): ShippingMethod | null {
    return this.selectedShippingMethod();
  }

  /**
   * Establece el método de envío directamente
   */
  setShippingMethod(methodId: string): void {
    const method = this.getShippingMethodById(methodId);
    this.selectedShippingMethod.set(method);
    
    // Si hay datos de envío, actualizar el método en ellos también
    const currentData = this.shippingData();
    if (currentData) {
      const updatedData = { ...currentData, shippingMethod: methodId };
      this.setShippingData(updatedData);
    }
  }

  /**
   * Limpia todos los datos de envío
   */
  clearShippingData(): void {
    this.shippingData.set(null);
    this.selectedShippingMethod.set(null);
    localStorage.removeItem(this.SHIPPING_KEY);
    
    // También limpiar el storage legacy por compatibilidad
    localStorage.removeItem('agromarket_shipping_data');
  }

  /**
   * Limpia todos los datos del checkout (envío y cualquier dato relacionado)
   * Se ejecuta después de un pago exitoso para reiniciar el flujo
   */
  clearAllCheckoutData(): void {
    this.clearShippingData();
    
    // Limpiar cualquier otro dato del checkout que pueda existir
    // Por ejemplo, datos temporales de pago, preferencias, etc.
    localStorage.removeItem('agromarket_checkout_temp');
    localStorage.removeItem('agromarket_payment_preferences');
  }

  /**
   * Guarda los datos de envío en localStorage
   */
  private saveShippingDataToStorage(data: ShippingData): void {
    try {
      localStorage.setItem(this.SHIPPING_KEY, JSON.stringify(data));
      
      // También guardar en el key legacy por compatibilidad
      localStorage.setItem('agromarket_shipping_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving shipping data to localStorage:', error);
    }
  }

  /**
   * Carga los datos de envío desde localStorage
   */
  private loadShippingDataFromStorage(): void {
    try {
      const storedData = localStorage.getItem(this.SHIPPING_KEY) || 
                        localStorage.getItem('agromarket_shipping_data');
      
      if (storedData) {
        const data: ShippingData = JSON.parse(storedData);
        this.shippingData.set(data);
        
        // Cargar el método de envío
        const method = this.getShippingMethodById(data.shippingMethod);
        this.selectedShippingMethod.set(method);
      }
    } catch (error) {
      console.error('Error loading shipping data from localStorage:', error);
    }
  }

  /**
   * Formatea un precio en pesos colombianos
   */
  formatPrice(price: number): string {
    if (price === 0) return 'Gratis';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  /**
   * Verifica si hay datos de envío completos
   */
  hasCompleteShippingData(): boolean {
    const data = this.shippingData();
    return !!(data && 
      data.firstName && 
      data.lastName && 
      data.email && 
      data.phone && 
      data.address && 
      data.city && 
      data.state && 
      data.zipCode && 
      data.shippingMethod
    );
  }
}