/**
 * Página de Mis Ventas para AgroMarket
 * 
 * @description Página mockup que muestra las ventas simuladas del agricultor
 * con resúmenes de pedidos, ingresos y estadísticas.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Interfaz para una venta mockup
 */
interface SaleRecord {
  id: string;
  fecha: string;
  cliente: string;
  productos: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
  total: number;
  estado: 'pendiente' | 'confirmado' | 'entregado' | 'cancelado';
  metodoPago: string;
}

/**
 * Interfaz para estadísticas de ventas
 */
interface SalesStats {
  totalVentas: number;
  ventasDelMes: number;
  ingresosTotales: number;
  ingresosDelMes: number;
  productosVendidos: number;
  clientesUnicos: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sales-container">
      <!-- Header de la página -->
      <div class="page-header">
        <div class="header-content">
          <button 
            class="btn-back"
            (click)="goBack()"
            aria-label="Volver al perfil">
            ← Volver al Perfil
          </button>
          <div class="title-section">
            <h1 class="page-title">
              <span class="title-icon">💰</span>
              Mis Ventas
            </h1>
            <p class="page-subtitle">Gestiona tus ventas y revisa tus ingresos</p>
          </div>
        </div>
      </div>

      <!-- Estadísticas resumidas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ formatPrice(stats().ingresosTotales) }}</div>
            <div class="stat-label">Ingresos Totales</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💳</div>
          <div class="stat-content">
            <div class="stat-value">{{ formatPrice(stats().ingresosDelMes) }}</div>
            <div class="stat-label">Ingresos del Mes</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats().totalVentas }}</div>
            <div class="stat-label">Total de Ventas</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats().clientesUnicos }}</div>
            <div class="stat-label">Clientes Únicos</div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="filters-row">
          <select class="filter-select" [(ngModel)]="selectedFilter" (change)="onFilterChange()">
            <option value="todas">Todas las ventas</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmado">Confirmadas</option>
            <option value="entregado">Entregadas</option>
            <option value="cancelado">Canceladas</option>
          </select>
          
          <select class="filter-select" [(ngModel)]="selectedPeriod" (change)="onPeriodChange()">
            <option value="todas">Todos los períodos</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="trimestre">Este trimestre</option>
          </select>
        </div>
      </div>

      <!-- Lista de ventas -->
      <div class="sales-section">
        <h2 class="section-title">Historial de Ventas</h2>
        
        @if (filteredSales().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No hay ventas para mostrar</h3>
            <p>No se encontraron ventas que coincidan con los filtros seleccionados.</p>
          </div>
        } @else {
          <div class="sales-list">
            @for (sale of filteredSales(); track sale.id) {
              <div class="sale-card">
                <div class="sale-header">
                  <div class="sale-info">
                    <div class="sale-id">Venta #{{ sale.id }}</div>
                    <div class="sale-date">{{ formatDate(sale.fecha) }}</div>
                  </div>
                  <div class="sale-status">
                    <span class="status-badge status-{{ sale.estado }}">
                      {{ getStatusLabel(sale.estado) }}
                    </span>
                  </div>
                </div>
                
                <div class="sale-content">
                  <div class="sale-customer">
                    <strong>Cliente:</strong> {{ sale.cliente }}
                  </div>
                  
                  <div class="sale-products">
                    <strong>Productos:</strong>
                    <ul class="products-list">
                      @for (producto of sale.productos; track producto.nombre) {
                        <li>
                          {{ producto.nombre }} - {{ producto.cantidad }} unidades × {{ formatPrice(producto.precio) }}
                        </li>
                      }
                    </ul>
                  </div>
                  
                  <div class="sale-footer">
                    <div class="sale-payment">
                      <strong>Método de pago:</strong> {{ sale.metodoPago }}
                    </div>
                    <div class="sale-total">
                      <strong>Total: {{ formatPrice(sale.total) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .sales-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
      min-height: calc(100vh - 120px);
    }

    .page-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .btn-back {
      background: none;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 8px 12px;
      color: var(--agro-muted);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .btn-back:hover {
      border-color: var(--agro-green-400);
      color: var(--agro-green-500);
    }

    .title-section {
      flex: 1;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--agro-text);
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .title-icon {
      font-size: 2rem;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: var(--agro-muted);
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      border-color: var(--agro-green-400);
      box-shadow: 0 4px 12px rgba(32, 201, 151, 0.1);
    }

    .stat-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--agro-text);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--agro-muted);
    }

    .filters-section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }

    .filters-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: white;
      color: var(--agro-text);
      cursor: pointer;
      min-width: 150px;
    }

    .filter-select:focus {
      outline: 2px solid var(--agro-green-400);
      border-color: var(--agro-green-400);
    }

    .sales-section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--agro-text);
      margin: 0 0 24px 0;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      color: var(--agro-text);
      margin-bottom: 8px;
    }

    .empty-state p {
      color: var(--agro-muted);
    }

    .sales-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sale-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.2s ease;
    }

    .sale-card:hover {
      border-color: var(--agro-green-400);
      box-shadow: 0 2px 8px rgba(32, 201, 151, 0.1);
    }

    .sale-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f3f4f6;
    }

    .sale-id {
      font-weight: 600;
      color: var(--agro-text);
    }

    .sale-date {
      font-size: 0.875rem;
      color: var(--agro-muted);
      margin-top: 2px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-pendiente {
      background: #fef3c7;
      color: #92400e;
    }

    .status-confirmado {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .status-entregado {
      background: var(--agro-green-50);
      color: var(--agro-green-700);
    }

    .status-cancelado {
      background: #fee2e2;
      color: #dc2626;
    }

    .sale-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sale-customer,
    .sale-payment {
      font-size: 0.875rem;
      color: var(--agro-text);
    }

    .products-list {
      margin: 8px 0 0 16px;
      padding: 0;
    }

    .products-list li {
      font-size: 0.875rem;
      color: var(--agro-muted);
      margin-bottom: 4px;
    }

    .sale-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid #f3f4f6;
    }

    .sale-total {
      font-size: 1.1rem;
      color: var(--agro-green-600);
    }

    @media (max-width: 768px) {
      .sales-container {
        padding: 16px 12px;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .page-title {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .filters-row {
        flex-direction: column;
      }

      .filter-select {
        min-width: auto;
      }

      .sale-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .sale-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class SalesPage implements OnInit {
  selectedFilter = 'todas';
  selectedPeriod = 'todas';

  // Datos simulados de ventas
  private salesData = signal<SaleRecord[]>([
    {
      id: 'V001',
      fecha: '2025-09-15',
      cliente: 'María González',
      productos: [
        { nombre: 'Tomate Cherry', cantidad: 5, precio: 4500 },
        { nombre: 'Lechuga Romana', cantidad: 3, precio: 2800 }
      ],
      total: 31000,
      estado: 'entregado',
      metodoPago: 'Tarjeta de Crédito'
    },
    {
      id: 'V002',
      fecha: '2025-09-14',
      cliente: 'Carlos Ruiz',
      productos: [
        { nombre: 'Zanahoria Orgánica', cantidad: 10, precio: 1200 }
      ],
      total: 12000,
      estado: 'confirmado',
      metodoPago: 'PSE'
    },
    {
      id: 'V003',
      fecha: '2025-09-13',
      cliente: 'Ana Martínez',
      productos: [
        { nombre: 'Espinaca Fresca', cantidad: 2, precio: 3500 },
        { nombre: 'Apio Criollo', cantidad: 4, precio: 2200 }
      ],
      total: 15800,
      estado: 'entregado',
      metodoPago: 'Bancolombia'
    },
    {
      id: 'V004',
      fecha: '2025-09-12',
      cliente: 'Luis Herrera',
      productos: [
        { nombre: 'Brócoli Premium', cantidad: 6, precio: 3800 }
      ],
      total: 22800,
      estado: 'pendiente',
      metodoPago: 'Tarjeta Débito'
    },
    {
      id: 'V005',
      fecha: '2025-09-10',
      cliente: 'Patricia Silva',
      productos: [
        { nombre: 'Cilantro Fresco', cantidad: 8, precio: 1500 },
        { nombre: 'Perejil Orgánico', cantidad: 5, precio: 1800 }
      ],
      total: 21000,
      estado: 'cancelado',
      metodoPago: 'PSE'
    }
  ]);

  // Computed para ventas filtradas
  filteredSales = computed(() => {
    let sales = this.salesData();
    
    if (this.selectedFilter !== 'todas') {
      sales = sales.filter(sale => sale.estado === this.selectedFilter);
    }
    
    // Aplicar filtro de período si es necesario
    if (this.selectedPeriod !== 'todas') {
      const now = new Date();
      sales = sales.filter(sale => {
        const saleDate = new Date(sale.fecha);
        switch (this.selectedPeriod) {
          case 'semana':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return saleDate >= weekAgo;
          case 'mes':
            return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
          case 'trimestre':
            const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
            return saleDate >= quarterStart;
          default:
            return true;
        }
      });
    }
    
    return sales.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  // Computed para estadísticas
  stats = computed(() => {
    const sales = this.salesData().filter(sale => sale.estado !== 'cancelado');
    const now = new Date();
    const currentMonth = sales.filter(sale => {
      const saleDate = new Date(sale.fecha);
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    });

    return {
      totalVentas: sales.length,
      ventasDelMes: currentMonth.length,
      ingresosTotales: sales.reduce((sum, sale) => sum + sale.total, 0),
      ingresosDelMes: currentMonth.reduce((sum, sale) => sum + sale.total, 0),
      productosVendidos: sales.reduce((sum, sale) => sum + sale.productos.reduce((pSum, p) => pSum + p.cantidad, 0), 0),
      clientesUnicos: new Set(sales.map(sale => sale.cliente)).size
    };
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  onFilterChange(): void {
    // Los filtros se aplican automáticamente a través del computed
  }

  onPeriodChange(): void {
    // Los filtros se aplican automáticamente a través del computed
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusLabel(status: string): string {
    const labels = {
      'pendiente': 'Pendiente',
      'confirmado': 'Confirmado',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return labels[status as keyof typeof labels] || status;
  }
}