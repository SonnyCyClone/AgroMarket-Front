/**
 * Página de éxito de pago - AgroMarket
 * 
 * @description Página mostrada después de un pago exitoso.
 * Muestra detalles de la transacción y limpia el carrito.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggingService } from '../../../core/services/logging/logging.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkout-success-container">
      <div class="success-content">
        <div class="success-icon">✅</div>
        
        <h1 class="success-title">¡Pago Exitoso!</h1>
        
        <p class="success-message">
          Tu pedido ha sido procesado correctamente y será enviado pronto.
        </p>
        
        <div class="transaction-details" *ngIf="transactionId">
          <h3>Detalles de la Transacción</h3>
          <div class="detail-row">
            <span>ID de Transacción:</span>
            <strong>{{ transactionId }}</strong>
          </div>
          <div class="detail-row" *ngIf="paymentMethod">
            <span>Método de Pago:</span>
            <strong>{{ getPaymentMethodName(paymentMethod) }}</strong>
          </div>
          <div class="detail-row">
            <span>Fecha:</span>
            <strong>{{ getCurrentDate() }}</strong>
          </div>
        </div>
        
        <div class="success-actions">
          <button class="btn-primary" (click)="goToHome()">
            🏠 Continuar Comprando
          </button>
          
          <button class="btn-secondary" (click)="goToOrders()">
            📦 Ver Mis Pedidos
          </button>
        </div>
        
        <div class="next-steps">
          <h3>Próximos Pasos</h3>
          <ul>
            <li>Recibirás un email de confirmación en unos minutos</li>
            <li>Prepararemos tu pedido para envío</li>
            <li>Te notificaremos cuando esté en camino</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-success-container {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
    }
    
    .success-content {
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      border-top: 6px solid #28a745;
    }
    
    .success-icon {
      font-size: 4rem;
      margin-bottom: 40px;
    }
    
    .success-title {
      color: #28a745;
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 15px 0;
    }
    
    .success-message {
      font-size: 1.2rem;
      color: #6c757d;
      margin: 0 0 30px 0;
      line-height: 1.5;
    }
    
    .transaction-details {
      background: rgba(40, 167, 69, 0.1);
      padding: 25px;
      border-radius: 12px;
      margin: 30px 0;
      text-align: left;
    }
    
    .transaction-details h3 {
      color: #28a745;
      margin: 0 0 15px 0;
      text-align: center;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }
    
    .detail-row:last-child {
      border-bottom: none;
    }
    
    .success-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    
    .btn-primary, .btn-secondary {
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #218838, #1ea085);
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
    
    .next-steps {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 12px;
      margin-top: 30px;
      text-align: left;
    }
    
    .next-steps h3 {
      color: #28a745;
      margin: 0 0 15px 0;
      text-align: center;
    }
    
    .next-steps ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .next-steps li {
      margin: 8px 0;
      color: #6c757d;
    }
    
    @media (max-width: 768px) {
      .checkout-success-container {
        margin: 20px auto;
        padding: 15px;
      }
      
      .success-content {
        padding: 30px 20px;
      }
      
      .success-title {
        font-size: 2rem;
      }
      
      .success-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .btn-primary, .btn-secondary {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class CheckoutSuccessPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private logger = inject(LoggingService);
  
  transactionId: string | null = null;
  paymentMethod: string | null = null;
  message: string | null = null;
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.transactionId = params['transactionId'];
      this.paymentMethod = params['method'];
      this.message = params['message'];
      
      this.logger.info(`Checkout success: ${this.transactionId}`, 'CheckoutSuccess');
    });
  }
  
  goToHome(): void {
    this.router.navigate(['/']);
  }
  
  goToOrders(): void {
    // TODO: Implementar página de pedidos
    this.router.navigate(['/'], { 
      queryParams: { message: 'Página de pedidos próximamente disponible' }
    });
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
  
  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}