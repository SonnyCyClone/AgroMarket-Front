/**
 * Página de información de envío - AgroMarket
 * 
 * @description Segunda etapa del checkout para capturar información
 * de envío del cliente incluyendo dirección y método de entrega.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Componente de información de envío
 * 
 * @description Captura datos de dirección y método de envío
 * del cliente para proceder al pago.
 */
@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-shipping.page.html',
  styleUrl: './checkout-shipping.page.css'
})
export class CheckoutShippingPage implements OnInit {
  /** Formulario de información de envío */
  shippingForm!: FormGroup;
  
  /** Estado de carga */
  loading = false;

  /** Opciones de método de envío */
  shippingMethods = [
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Inicialización del componente
   */
  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa el formulario de envío
   * 
   * @private
   */
  private initializeForm(): void {
    this.shippingForm = this.formBuilder.group({
      // Información personal
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      
      // Información de dirección
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
      country: ['Colombia', [Validators.required]],
      
      // Método de envío
      shippingMethod: ['standard', [Validators.required]],
      
      // Instrucciones especiales
      specialInstructions: ['']
    });
  }

  /**
   * Procede a la siguiente etapa del checkout (pago)
   */
  proceedToPayment(): void {
    if (this.shippingForm.invalid) {
      this.markFormGroupTouched();
      this.snackBar.open(
        'Por favor completa todos los campos requeridos',
        'Cerrar',
        { duration: 4000 }
      );
      return;
    }

    this.loading = true;

    // Simular validación de dirección
    setTimeout(() => {
      const shippingData = this.shippingForm.value;
      
      // Guardar datos de envío en localStorage
      localStorage.setItem('agromarket_shipping_data', JSON.stringify(shippingData));
      
      this.loading = false;
      this.router.navigate(['/checkout/payment']);
    }, 1500);
  }

  /**
   * Regresa al resumen del pedido
   */
  backToSummary(): void {
    this.router.navigate(['/checkout/summary']);
  }

  /**
   * Obtiene el precio del método de envío seleccionado
   */
  getSelectedShippingPrice(): number {
    const selectedMethod = this.shippingForm.get('shippingMethod')?.value;
    const method = this.shippingMethods.find(m => m.id === selectedMethod);
    return method ? method.price : 0;
  }

  /**
   * Obtiene el nombre del método de envío seleccionado
   */
  getSelectedShippingMethodName(): string {
    const selectedMethod = this.shippingForm.get('shippingMethod')?.value;
    const method = this.shippingMethods.find(m => m.id === selectedMethod);
    return method ? method.name : 'Selecciona un método';
  }

  /**
   * Formatea un precio en pesos colombianos
   * 
   * @param {number} price - Precio a formatear
   * @returns {string} Precio formateado
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
   * Verifica si un campo del formulario es inválido y ha sido tocado
   * 
   * @param {string} fieldName - Nombre del campo
   * @returns {boolean} True si el campo es inválido y ha sido tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.shippingForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   * 
   * @param {string} fieldName - Nombre del campo
   * @returns {string} Mensaje de error
   */
  getFieldError(fieldName: string): string {
    const field = this.shippingForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    
    if (errors['required']) return 'Este campo es requerido';
    if (errors['email']) return 'Email inválido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['pattern']) return 'Formato inválido';
    
    return 'Campo inválido';
  }

  /**
   * Marca todos los campos del formulario como tocados
   * 
   * @private
   */
  private markFormGroupTouched(): void {
    Object.keys(this.shippingForm.controls).forEach(key => {
      const control = this.shippingForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Verifica si el formulario tiene errores de validación
   * 
   * @returns {boolean} True si hay errores
   */
  hasFormErrors(): boolean {
    return this.shippingForm.invalid && this.shippingForm.touched;
  }

  /**
   * Cuenta el número de errores de validación en el formulario
   * 
   * @returns {number} Número de campos con errores
   */
  getFormErrorCount(): number {
    let errorCount = 0;
    Object.keys(this.shippingForm.controls).forEach(key => {
      const control = this.shippingForm.get(key);
      if (control && control.invalid && control.touched) {
        errorCount++;
      }
    });
    return errorCount;
  }
}