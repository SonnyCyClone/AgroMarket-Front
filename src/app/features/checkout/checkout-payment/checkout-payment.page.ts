/**
 * Página de métodos de pago para checkout - AgroMarket
 * 
 * @description Componente que maneja la selección de métodos de pago
 * específicos para Colombia (PSE, Bancolombia, tarjetas) con flujo
 * de aprobación/rechazo simulado y labels en español.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { LoggingService } from '../../../core/services/logging/logging.service';

/**
 * Tipos de métodos de pago disponibles en Colombia
 */
export type PaymentMethod = 'pse' | 'bancolombia' | 'credit' | 'debit';

/**
 * Bancos disponibles para PSE
 */
export interface PSEBank {
  id: string;
  name: string;
  code: string;
}

/**
 * Resultado de procesamiento de pago
 */
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorCode?: string;
  message: string;
}

/**
 * Componente de métodos de pago colombianos
 */
@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout-payment.page.html',
  styleUrl: './checkout-payment.page.css'
})
export class CheckoutPaymentPage implements OnInit {
  /** Servicio de carrito */
  private cartService = inject(CartService);
  
  /** Servicio de logging */
  private logger = inject(LoggingService);
  
  /** Router para navegación */
  private router = inject(Router);
  
  /** FormBuilder para formularios reactivos */
  private fb = inject(FormBuilder);

  /** Estado del mensaje de notificación */
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  /** Método de pago seleccionado */
  selectedPaymentMethod: PaymentMethod | null = null;

  /** Formulario de datos de pago */
  paymentForm: FormGroup;

  /** Estado de procesamiento de pago */
  isProcessing = false;

  /** Resumen del carrito */
  cartSummary$ = this.cartService.summary;

  /** Bancos disponibles para PSE */
  pseBanks: PSEBank[] = [
    { id: 'bancolombia', name: 'Bancolombia', code: '1007' },
    { id: 'banco_bogota', name: 'Banco de Bogotá', code: '1001' },
    { id: 'banco_popular', name: 'Banco Popular', code: '1002' },
    { id: 'bbva', name: 'BBVA Colombia', code: '1013' },
    { id: 'davivienda', name: 'Banco Davivienda', code: '1051' },
    { id: 'colpatria', name: 'Scotiabank Colpatria', code: '1019' },
    { id: 'av_villas', name: 'Banco AV Villas', code: '1052' },
    { id: 'banco_caja_social', name: 'Banco Caja Social', code: '1032' }
  ];

  /** Tarjetas de crédito/débito aceptadas */
  cardTypes = [
    { id: 'visa', name: 'Visa', icon: '💳' },
    { id: 'mastercard', name: 'Mastercard', icon: '💳' },
    { id: 'american_express', name: 'American Express', icon: '💳' },
    { id: 'diners', name: 'Diners Club', icon: '💳' }
  ];

  constructor() {
    this.paymentForm = this.fb.group({
      // Campos PSE
      pseBank: [''],
      pseUserType: ['natural'], // 'natural' o 'juridica'
      pseDocumentType: ['cc'], // 'cc', 'ce', 'nit'
      pseDocumentNumber: ['', [Validators.pattern(/^\d+$/)]],
      
      // Campos Bancolombia
      bancolombiaUser: [''],
      bancolombiaPassword: [''],
      
      // Campos tarjeta
      cardNumber: ['', [Validators.pattern(/^\d{16}$/)]],
      cardExpiry: ['', [Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cardCVV: ['', [Validators.pattern(/^\d{3,4}$/)]],
      cardName: ['', Validators.minLength(3)],
      cardType: ['']
    });
  }

  ngOnInit(): void {
    this.logger.info('CheckoutPaymentPage inicializada', 'CheckoutPayment');
  }

  /**
   * Selecciona un método de pago
   */
  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod = method;
    this.logger.info(`Método de pago seleccionado: ${method}`, 'CheckoutPayment');
    
    // Limpiar validadores previos
    this.clearValidators();
    
    // Configurar validadores según el método seleccionado
    switch (method) {
      case 'pse':
        this.paymentForm.get('pseBank')?.setValidators([Validators.required]);
        this.paymentForm.get('pseDocumentNumber')?.setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
        break;
        
      case 'bancolombia':
        this.paymentForm.get('bancolombiaUser')?.setValidators([Validators.required, Validators.minLength(3)]);
        this.paymentForm.get('bancolombiaPassword')?.setValidators([Validators.required, Validators.minLength(4)]);
        break;
        
      case 'credit':
      case 'debit':
        this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
        this.paymentForm.get('cardExpiry')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
        this.paymentForm.get('cardCVV')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
        this.paymentForm.get('cardName')?.setValidators([Validators.required, Validators.minLength(3)]);
        this.paymentForm.get('cardType')?.setValidators([Validators.required]);
        break;
    }
    
    this.paymentForm.updateValueAndValidity();
  }

  /**
   * Limpia todos los validadores del formulario
   */
  private clearValidators(): void {
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.clearValidators();
      this.paymentForm.get(key)?.updateValueAndValidity();
    });
  }

  /**
   * Procesa el pago con el método seleccionado
   */
  async processPayment(): Promise<void> {
    if (!this.selectedPaymentMethod || this.isProcessing) {
      return;
    }

    // Validar formulario según el método seleccionado
    if (!this.isFormValid()) {
      this.showToast('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    this.isProcessing = true;
    this.logger.info(`Iniciando procesamiento de pago con ${this.selectedPaymentMethod}`, 'CheckoutPayment');

    try {
      // Simular procesamiento de pago
      const result = await this.simulatePaymentProcessing();
      
      if (result.success) {
        this.handlePaymentSuccess(result);
      } else {
        this.handlePaymentFailure(result);
      }
    } catch (error) {
      this.logger.error('Error inesperado en procesamiento de pago', 'CheckoutPayment', error);
      this.handlePaymentFailure({
        success: false,
        errorCode: 'UNEXPECTED_ERROR',
        message: 'Error inesperado. Intente nuevamente.'
      });
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Valida el formulario según el método de pago seleccionado
   */
  isFormValid(): boolean {
    switch (this.selectedPaymentMethod) {
      case 'pse':
        return !!(this.paymentForm.value.pseBank && this.paymentForm.value.pseDocumentNumber);
        
      case 'bancolombia':
        return !!(this.paymentForm.value.bancolombiaUser && this.paymentForm.value.bancolombiaPassword);
        
      case 'credit':
      case 'debit':
        return !!(
          this.paymentForm.value.cardNumber &&
          this.paymentForm.value.cardExpiry &&
          this.paymentForm.value.cardCVV &&
          this.paymentForm.value.cardName &&
          this.paymentForm.value.cardType
        );
        
      default:
        return false;
    }
  }

  /**
   * Simula el procesamiento de pago con diferentes escenarios
   */
  private async simulatePaymentProcessing(): Promise<PaymentResult> {
    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Simular diferentes resultados (80% éxito, 20% fallo)
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      return {
        success: true,
        transactionId: this.generateTransactionId(),
        message: 'Pago procesado exitosamente'
      };
    } else {
      // Simular diferentes tipos de error
      const errorTypes = [
        { code: 'INSUFFICIENT_FUNDS', message: 'Fondos insuficientes' },
        { code: 'CARD_DECLINED', message: 'Tarjeta rechazada por el banco' },
        { code: 'BANK_ERROR', message: 'Error en la comunicación con el banco' },
        { code: 'TIMEOUT', message: 'Tiempo de espera agotado' },
        { code: 'INVALID_DATA', message: 'Datos de pago inválidos' }
      ];
      
      const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      
      return {
        success: false,
        errorCode: randomError.code,
        message: randomError.message
      };
    }
  }

  /**
   * Genera un ID de transacción simulado
   */
  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  }

  /**
   * Maneja el éxito del pago
   */
  private handlePaymentSuccess(result: PaymentResult): void {
    this.logger.info(`Pago exitoso: ${result.transactionId}`, 'CheckoutPayment');
    
    // Limpiar carrito solo en caso de éxito
    this.cartService.clearCart();
    
    // Redirigir a página de éxito con datos de transacción
    this.router.navigate(['/checkout/success'], {
      queryParams: {
        transactionId: result.transactionId,
        method: this.selectedPaymentMethod,
        message: result.message
      }
    });
  }

  /**
   * Maneja el fallo del pago
   */
  private handlePaymentFailure(result: PaymentResult): void {
    this.logger.warn(`Pago fallido: ${result.errorCode}`, 'CheckoutPayment');
    
    // NO limpiar carrito en caso de fallo - preservar para reintento
    
    // Mostrar mensaje de error
    this.showToast(`Error en el pago: ${result.message}`, 'error');
    
    // Opcional: Redirigir a página de fallo
    this.router.navigate(['/checkout/failure'], {
      queryParams: {
        errorCode: result.errorCode,
        method: this.selectedPaymentMethod,
        message: result.message
      }
    });
  }

  /**
   * Vuelve a la página de envío
   */
  goBack(): void {
    this.router.navigate(['/checkout/shipping']);
  }

  /**
   * Obtiene el nombre del método de pago para mostrar
   */
  getPaymentMethodName(method: PaymentMethod): string {
    const names = {
      pse: 'PSE - Pagos Seguros en Línea',
      bancolombia: 'Bancolombia Sucursal Virtual',
      credit: 'Tarjeta de Crédito',
      debit: 'Tarjeta Débito'
    };
    return names[method];
  }

  /**
   * Obtiene el icono del método de pago
   */
  getPaymentMethodIcon(method: PaymentMethod): string {
    const icons = {
      pse: '🏛️',
      bancolombia: '🏦',
      credit: '💳',
      debit: '💳'
    };
    return icons[method];
  }

  /**
   * Formatea el precio en pesos colombianos
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  /**
   * Formatea número de tarjeta mientras se escribe
   */
  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.paymentForm.patchValue({ cardNumber: value.replace(/\s/g, '') });
    event.target.value = value;
  }

  /**
   * Formatea fecha de expiración mientras se escribe
   */
  formatCardExpiry(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.paymentForm.patchValue({ cardExpiry: value });
  }

  /**
   * Muestra un mensaje de notificación
   */
  private showToast(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }

  /**
   * Oculta el mensaje de notificación
   */
  hideNotification(): void {
    this.showNotification = false;
    this.notificationMessage = '';
  }
}