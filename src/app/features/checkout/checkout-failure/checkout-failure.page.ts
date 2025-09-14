/**
 * Página de fallo de pago - AgroMarket
 * 
 * @description Página mostrada después de un pago fallido.
 * Preserva el carrito y permite reintentar el pago.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggingService } from '../../../core/services/logging/logging.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-checkout-failure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkout-failure-container">
      <div class="failure-content">
        <div class="failure-icon">❌</div>
        
        <h1 class="failure-title">Pago No Procesado</h1>
        
        <p class="failure-message">
          Hubo un problema al procesar tu pago. No te preocupes, tu carrito se ha mantenido intacto.
        </p>
        
        <div class="error-details" *ngIf="errorCode || errorMessage">
          <h3>Detalles del Error</h3>
          <div class="error-info">
            <div class="error-row" *ngIf="errorCode">
              <span>Código de Error:</span>
              <strong>{{ errorCode }}</strong>
            </div>
            <div class="error-row" *ngIf="errorMessage">
              <span>Descripción:</span>
              <strong>{{ errorMessage }}</strong>
            </div>
            <div class="error-row" *ngIf="paymentMethod">
              <span>Método Utilizado:</span>
              <strong>{{ getPaymentMethodName(paymentMethod) }}</strong>
            </div>
          </div>
        </div>
        
        <div class="common-solutions">
          <h3>Soluciones Comunes</h3>
          <ul>
            <li *ngIf="isInsufficientFunds()">Verificar saldo disponible en tu cuenta</li>
            <li *ngIf="isCardIssue()">Contactar a tu banco para verificar la tarjeta</li>
            <li *ngIf="isBankError()">Intentar nuevamente en unos minutos</li>
            <li *ngIf="isTimeoutError()">Verificar tu conexión a internet</li>
            <li>Intentar con un método de pago diferente</li>
            <li>Contactar a nuestro soporte si el problema persiste</li>
          </ul>
        </div>
        
        <div class="failure-actions">
          <button class="btn-retry" (click)="retryPayment()">
            🔄 Intentar Nuevamente
          </button>
          
          <button class="btn-change-method" (click)="changePaymentMethod()">
            💳 Cambiar Método de Pago
          </button>
          
          <button class="btn-secondary" (click)="goToCart()">
            🛒 Ver Carrito
          </button>
        </div>
        
        <div class="cart-preserved">
          <div class="preservation-notice">
            <span class="preservation-icon">🛡️</span>
            <div class="preservation-text">
              <strong>Tu carrito está protegido</strong>
              <br>Todos tus productos seleccionados se mantienen guardados
            </div>
          </div>
          
          <div class="cart-summary" *ngIf="cartSummary$()">
            <div class="summary-row">
              <span>{{ cartSummary$().itemCount }} productos</span>
              <span>{{ formatPrice(cartSummary$().total) }}</span>
            </div>
          </div>
        </div>
        
        <div class="support-info">
          <h3>¿Necesitas Ayuda?</h3>
          <p>Nuestro equipo de soporte está disponible para ayudarte</p>
          <button class="btn-support" (click)="contactSupport()">
            📞 Contactar Soporte
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-failure-container {
      max-width: 700px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
    }
    
    .failure-content {
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(220, 53, 69, 0.15);
      border-top: 6px solid #dc3545;
    }
    
    .failure-icon {
      font-size: 4rem;
      margin-bottom: 40px;
    }
    
    .failure-title {
      color: #dc3545;
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 15px 0;
    }
    
    .failure-message {
      font-size: 1.2rem;
      color: var(--am-text-secondary);
      margin: 0 0 30px 0;
      line-height: 1.5;
    }
    
    .error-details {
      background: #fff5f5;
      border: 1px solid #fecaca;
      padding: 25px;
      border-radius: 12px;
      margin: 30px 0;
      text-align: left;
    }
    
    .error-details h3 {
      color: #dc3545;
      margin: 0 0 15px 0;
      text-align: center;
    }
    
    .error-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #fecaca;
    }
    
    .error-row:last-child {
      border-bottom: none;
    }
    
    .common-solutions {
      background: #f0fff4;
      padding: 25px;
      border-radius: 12px;
      margin: 30px 0;
      text-align: left;
    }
    
    .common-solutions h3 {
      color: #28a745;
      margin: 0 0 15px 0;
      text-align: center;
    }
    
    .common-solutions ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .common-solutions li {
      margin: 8px 0;
      color: var(--am-text-primary);
    }
    
    .failure-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    
    .btn-retry, .btn-change-method, .btn-secondary, .btn-support {
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    
    .btn-retry {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      border: none;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .btn-retry:hover {
      background: linear-gradient(135deg, #218838, #1ea085);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }
    
    .btn-retry:focus-visible {
      outline: 2px solid #28a745;
      outline-offset: 2px;
    }
    
    .btn-change-method {
      background: #ff6b35;
      color: white;
    }
    
    .btn-change-method:hover {
      background: #e55a2e;
      transform: translateY(-2px);
    }
    
    .btn-secondary {
      background: white;
      color: #28a745;
      border: 2px solid #28a745;
    }
    
    .btn-secondary:hover {
      background: #28a745;
      color: white;
    }
    
    .btn-support {
      background: #6c757d;
      color: white;
    }
    
    .btn-support:hover {
      background: #5a6268;
      transform: translateY(-2px);
    }
    
    .cart-preserved {
      background: #e8f5e8;
      border: 2px solid #28a745;
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
    }
    
    .preservation-notice {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .preservation-icon {
      font-size: 2rem;
    }
    
    .preservation-text {
      text-align: left;
      color: var(--am-primary-dark);
    }
    
    .cart-summary {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      color: var(--am-primary);
    }
    
    .support-info {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 12px;
      margin-top: 30px;
    }
    
    .support-info h3 {
      color: var(--am-text-primary);
      margin: 0 0 10px 0;
    }
    
    .support-info p {
      color: var(--am-text-secondary);
      margin: 0 0 20px 0;
    }
    
    @media (max-width: 768px) {
      .checkout-failure-container {
        margin: 20px auto;
        padding: 15px;
      }
      
      .failure-content {
        padding: 30px 20px;
      }
      
      .failure-title {
        font-size: 2rem;
      }
      
      .failure-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .btn-retry, .btn-change-method, .btn-secondary, .btn-support {
        width: 100%;
        max-width: 300px;
      }
      
      .preservation-notice {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }
      
      .preservation-text {
        text-align: center;
      }
    }
  `]
})
export class CheckoutFailurePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private logger = inject(LoggingService);
  private cartService = inject(CartService);
  
  errorCode: string | null = null;
  errorMessage: string | null = null;
  paymentMethod: string | null = null;
  
  cartSummary$ = this.cartService.summary;
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.errorCode = params['errorCode'];
      this.errorMessage = params['message'];
      this.paymentMethod = params['method'];
      
      this.logger.warn(`Checkout failure: ${this.errorCode}`, 'CheckoutFailure');
    });
  }
  
  retryPayment(): void {
    this.router.navigate(['/checkout/payment']);
  }
  
  changePaymentMethod(): void {
    this.router.navigate(['/checkout/payment']);
  }
  
  goToCart(): void {
    this.router.navigate(['/cart']);
  }
  
  contactSupport(): void {
    // TODO: Implementar contacto con soporte
    alert('Función de soporte próximamente disponible.\nPor favor contacta: soporte@agromarket.com');
  }
  
  getPaymentMethodName(method: string): string {
    const names: { [key: string]: string } = {
      pse: 'PSE - Pagos Seguros en Línea',
      bancolombia: 'Bancolombia Sucursal Virtual',
      credit: 'Tarjeta de Crédito',
      debit: 'Tarjeta Débito'
    };
    return names[method] || method;
  }
  
  isInsufficientFunds(): boolean {
    return this.errorCode === 'INSUFFICIENT_FUNDS';
  }
  
  isCardIssue(): boolean {
    return this.errorCode === 'CARD_DECLINED';
  }
  
  isBankError(): boolean {
    return this.errorCode === 'BANK_ERROR';
  }
  
  isTimeoutError(): boolean {
    return this.errorCode === 'TIMEOUT';
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