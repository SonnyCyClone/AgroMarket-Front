/**
 * Página de historial de compras - AgroMarket Profile
 */

import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Purchase {
  id: string;
  orderNumber: string;
  date: Date;
  status: 'completed' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: PurchaseItem[];
  shippingAddress: string;
  paymentMethod: string;
}

interface PurchaseItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  unit: string;
}

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="purchases-container">
      <div class="breadcrumb">
        <button class="agro-outline" (click)="goBack()">← Volver al perfil</button>
      </div>

      <header class="page-header">
        <h1>Historial de compras</h1>
        <p>Revisa todas tus órdenes y descargas facturas</p>
      </header>

      <!-- Filtros -->
      <div class="filters-section">
        <form [formGroup]="filterForm" class="filters-form">
          <div class="filter-group">
            <label for="inpDateFrom">Desde</label>
            <input 
              id="inpDateFrom"
              type="date" 
              formControlName="dateFrom"
              class="form-input"
            >
          </div>
          
          <div class="filter-group">
            <label for="inpDateTo">Hasta</label>
            <input 
              id="inpDateTo"
              type="date" 
              formControlName="dateTo"
              class="form-input"
            >
          </div>
          
          <div class="filter-group">
            <label for="inpStatus">Estado</label>
            <select 
              id="inpStatus"
              formControlName="status"
              class="form-input"
            >
              <option value="">Todos los estados</option>
              <option value="completed">Completado</option>
              <option value="shipped">Enviado</option>
              <option value="processing">Procesando</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="inpSearch">Buscar</label>
            <input 
              id="inpSearch"
              type="text" 
              formControlName="search"
              class="form-input"
              placeholder="Número de orden, producto..."
            >
          </div>
          
          <button 
            type="button" 
            class="agro-outline"
            (click)="clearFilters()"
          >
            Limpiar
          </button>
        </form>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-value">{{ purchaseStats().totalOrders }}</div>
          <div class="stat-label">Órdenes totales</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">\${{ purchaseStats().totalSpent | number:'1.0-0' }}</div>
          <div class="stat-label">Total gastado</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ purchaseStats().thisMonth }}</div>
          <div class="stat-label">Este mes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ purchaseStats().avgOrder | number:'1.0-0' }}</div>
          <div class="stat-label">Promedio por orden</div>
        </div>
      </div>

      <!-- Lista de compras -->
      <div class="purchases-section">
        <div class="purchases-list" *ngIf="filteredPurchases().length > 0">
          <div *ngFor="let purchase of filteredPurchases()" class="purchase-card">
            <div class="purchase-header">
              <div class="purchase-info">
                <h3>Orden #{{ purchase.orderNumber }}</h3>
                <p class="purchase-date">{{ purchase.date | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
              
              <div class="purchase-status">
                <span class="status-badge" [class]="purchase.status">
                  {{ getStatusText(purchase.status) }}
                </span>
                <div class="purchase-total">\${{ purchase.total | number:'1.0-0' }}</div>
              </div>
            </div>
            
            <div class="purchase-items">
              <div *ngFor="let item of purchase.items" class="purchase-item">
                <img [src]="item.image" [alt]="item.name" class="item-image">
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.quantity }} {{ item.unit }} × \${{ item.price | number:'1.0-0' }}</p>
                </div>
                <div class="item-total">
                  \${{ (item.quantity * item.price) | number:'1.0-0' }}
                </div>
              </div>
            </div>
            
            <div class="purchase-details">
              <div class="detail-row">
                <span class="detail-label">Envío a:</span>
                <span class="detail-value">{{ purchase.shippingAddress }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pago:</span>
                <span class="detail-value">{{ purchase.paymentMethod }}</span>
              </div>
            </div>
            
            <div class="purchase-actions">
              <button 
                class="agro-outline small"
                (click)="viewOrderDetails(purchase)"
              >
                Ver detalles
              </button>
              <button 
                class="agro-outline small"
                (click)="downloadInvoice(purchase)"
              >
                📄 Descargar factura
              </button>
              <button 
                class="agro-primary small"
                *ngIf="purchase.status === 'completed'"
                (click)="reorderItems(purchase)"
                id="btnReorder{{ purchase.id }}"
              >
                Comprar de nuevo
              </button>
              <button 
                class="agro-outline small"
                *ngIf="purchase.status === 'shipped'"
                (click)="trackOrder(purchase)"
              >
                🚚 Rastrear envío
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="filteredPurchases().length === 0">
          <div class="empty-icon">🛒</div>
          <h4>{{ purchases().length === 0 ? 'No tienes compras aún' : 'No se encontraron compras' }}</h4>
          <p>{{ purchases().length === 0 ? 'Cuando realices tu primera compra aparecerá aquí' : 'Intenta ajustar los filtros de búsqueda' }}</p>
          <button 
            class="agro-primary"
            *ngIf="purchases().length === 0"
            (click)="goShopping()"
          >
            Ir a comprar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .purchases-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .breadcrumb {
      margin-bottom: 24px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      color: var(--agro-text);
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .page-header p {
      color: var(--agro-muted);
      margin: 0;
    }

    .filters-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .filters-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-group label {
      font-weight: 600;
      color: var(--agro-text);
      font-size: 0.9rem;
    }

    .form-input {
      padding: 10px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--agro-green-400);
      box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.25);
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 4px solid var(--agro-green-400);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--agro-green-500);
      margin-bottom: 8px;
    }

    .stat-label {
      color: var(--agro-muted);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .purchases-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .purchase-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }

    .purchase-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .purchase-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .purchase-info h3 {
      color: var(--agro-text);
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 4px 0;
    }

    .purchase-date {
      color: var(--agro-muted);
      margin: 0;
      font-size: 0.9rem;
    }

    .purchase-status {
      text-align: right;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .status-badge.completed {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.shipped {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.processing {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    .purchase-total {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--agro-green-500);
    }

    .purchase-items {
      margin-bottom: 20px;
    }

    .purchase-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .purchase-item:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
      background: #f3f4f6;
    }

    .item-details {
      flex: 1;
    }

    .item-details h4 {
      color: var(--agro-text);
      font-size: 0.95rem;
      font-weight: 600;
      margin: 0 0 4px 0;
    }

    .item-details p {
      color: var(--agro-muted);
      font-size: 0.875rem;
      margin: 0;
    }

    .item-total {
      font-weight: 600;
      color: var(--agro-text);
      font-size: 0.95rem;
    }

    .purchase-details {
      margin-bottom: 20px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .detail-row:last-child {
      margin-bottom: 0;
    }

    .detail-label {
      color: var(--agro-muted);
      font-weight: 500;
    }

    .detail-value {
      color: var(--agro-text);
      font-weight: 500;
      text-align: right;
      max-width: 60%;
    }

    .purchase-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .agro-outline.small,
    .agro-primary.small {
      padding: 8px 16px;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .empty-state h4 {
      color: var(--agro-text);
      margin: 0 0 8px 0;
    }

    .empty-state p {
      color: var(--agro-muted);
      margin: 0 0 24px 0;
    }

    @media (max-width: 768px) {
      .filters-form {
        grid-template-columns: 1fr;
      }

      .purchase-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .purchase-status {
        text-align: left;
      }

      .purchase-actions {
        flex-direction: column;
      }

      .item-details h4 {
        font-size: 0.9rem;
      }
    }
  `]
})
export class PurchasesPage {
  filterForm: FormGroup;

  purchases = signal<Purchase[]>([
    {
      id: '1',
      orderNumber: 'AGM-2024-001',
      date: new Date('2024-01-15T10:30:00'),
      status: 'completed',
      total: 45000,
      shippingAddress: 'Calle 123 #45-67, Apartamento 301, Bogotá',
      paymentMethod: 'Tarjeta terminada en 4532',
      items: [
        {
          id: '1',
          name: 'Tomates orgánicos',
          image: '/assets/icon/placeholder.png',
          quantity: 2,
          price: 8000,
          unit: 'kg'
        },
        {
          id: '2',
          name: 'Lechuga hidropónica',
          image: '/assets/icon/placeholder.png',
          quantity: 3,
          price: 5000,
          unit: 'unidad'
        },
        {
          id: '3',
          name: 'Zanahorias baby',
          image: '/assets/icon/placeholder.png',
          quantity: 1,
          price: 14000,
          unit: 'kg'
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'AGM-2024-002',
      date: new Date('2024-01-10T14:15:00'),
      status: 'shipped',
      total: 32000,
      shippingAddress: 'Carrera 15 #85-32, Oficina 504, Bogotá',
      paymentMethod: 'Transferencia bancaria',
      items: [
        {
          id: '4',
          name: 'Aguacates hass',
          image: '/assets/icon/placeholder.png',
          quantity: 2,
          price: 12000,
          unit: 'kg'
        },
        {
          id: '5',
          name: 'Plátanos maduros',
          image: '/assets/icon/placeholder.png',
          quantity: 1,
          price: 8000,
          unit: 'kg'
        }
      ]
    },
    {
      id: '3',
      orderNumber: 'AGM-2024-003',
      date: new Date('2024-01-05T09:45:00'),
      status: 'processing',
      total: 28000,
      shippingAddress: 'Calle 123 #45-67, Apartamento 301, Bogotá',
      paymentMethod: 'Tarjeta terminada en 8765',
      items: [
        {
          id: '6',
          name: 'Papas criollas',
          image: '/assets/icon/placeholder.png',
          quantity: 3,
          price: 6000,
          unit: 'kg'
        },
        {
          id: '7',
          name: 'Cilantro fresco',
          image: '/assets/icon/placeholder.png',
          quantity: 2,
          price: 5000,
          unit: 'atado'
        }
      ]
    }
  ]);

  filteredPurchases = computed(() => {
    const filters = this.filterForm.value;
    let filtered = [...this.purchases()];

    // Filtro por fecha desde
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(p => p.date >= fromDate);
    }

    // Filtro por fecha hasta
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter(p => p.date <= toDate);
    }

    // Filtro por estado
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Filtro por búsqueda
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.orderNumber.toLowerCase().includes(search) ||
        p.items.some(item => item.name.toLowerCase().includes(search))
      );
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  purchaseStats = computed(() => {
    const allPurchases = this.purchases();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthPurchases = allPurchases.filter(p => 
      p.date.getMonth() === currentMonth && p.date.getFullYear() === currentYear
    );

    const totalSpent = allPurchases.reduce((sum, p) => sum + p.total, 0);
    const avgOrder = allPurchases.length > 0 ? totalSpent / allPurchases.length : 0;

    return {
      totalOrders: allPurchases.length,
      totalSpent,
      thisMonth: thisMonthPurchases.length,
      avgOrder
    };
  });

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      status: [''],
      search: ['']
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  getStatusText(status: string): string {
    const statusTexts = {
      completed: 'Completado',
      shipped: 'Enviado',
      processing: 'Procesando',
      cancelled: 'Cancelado'
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  }

  viewOrderDetails(purchase: Purchase): void {
    alert(`Ver detalles de la orden ${purchase.orderNumber}`);
  }

  downloadInvoice(purchase: Purchase): void {
    alert(`Descargando factura de la orden ${purchase.orderNumber}`);
  }

  trackOrder(purchase: Purchase): void {
    alert(`Rastreando envío de la orden ${purchase.orderNumber}`);
  }

  reorderItems(purchase: Purchase): void {
    alert(`Agregando productos de la orden ${purchase.orderNumber} al carrito`);
  }

  goShopping(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}