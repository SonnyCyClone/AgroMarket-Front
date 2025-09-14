/**
 * Página principal del perfil de usuario - AgroMarket
 * 
 * @description Página landing del perfil que muestra una grid de tarjetas
 * para navegar a diferentes secciones del perfil del usuario
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileCard, MockUserProfile } from './profile.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1 class="profile-title">Mi Perfil</h1>
        <p class="profile-subtitle">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div class="profile-grid">
        <div 
          *ngFor="let card of profileCards()" 
          class="profile-card"
          (click)="navigateToSection(card.route)"
          (keydown.enter)="navigateToSection(card.route)"
          (keydown.space)="navigateToSection(card.route)"
          tabindex="0"
          role="button"
          [attr.aria-label]="'Ir a ' + card.title"
        >
          <div class="card-icon">{{ card.icon }}</div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-description">{{ card.description }}</p>
          <div class="card-arrow">→</div>
        </div>
      </div>

      <div class="profile-summary" *ngIf="userProfile()">
        <h2>Resumen de tu cuenta</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">Nombre completo</span>
            <span class="summary-value">{{ userProfile().fullName }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Email</span>
            <span class="summary-value">{{ userProfile().email }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Teléfono</span>
            <span class="summary-value">{{ userProfile().phone }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Direcciones</span>
            <span class="summary-value">{{ userProfile().addresses.length }} registradas</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px;
      min-height: calc(100vh - 120px);
    }

    .profile-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .profile-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--agro-text);
      margin: 0 0 8px 0;
    }

    .profile-subtitle {
      font-size: 1.1rem;
      color: var(--agro-muted);
      margin: 0;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .profile-card {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 32px 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .profile-card:hover {
      border-color: var(--agro-green-400);
      box-shadow: 0 8px 24px rgba(32, 201, 151, 0.15);
      transform: translateY(-2px);
    }

    .profile-card:focus {
      outline: none;
      border-color: var(--agro-green-400);
      box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.25);
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 16px;
      display: block;
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--agro-text);
      margin: 0 0 8px 0;
    }

    .card-description {
      font-size: 1rem;
      color: var(--agro-muted);
      margin: 0 0 16px 0;
      line-height: 1.5;
    }

    .card-arrow {
      position: absolute;
      top: 24px;
      right: 24px;
      font-size: 1.5rem;
      color: var(--agro-green-400);
      opacity: 0;
      transition: all 0.3s ease;
    }

    .profile-card:hover .card-arrow {
      opacity: 1;
      transform: translateX(4px);
    }

    .profile-summary {
      background: var(--agro-green-50);
      border-radius: 12px;
      padding: 32px;
      border: 1px solid var(--agro-green-400);
    }

    .profile-summary h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--agro-text);
      margin: 0 0 24px 0;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .summary-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--agro-muted);
    }

    .summary-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--agro-text);
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 16px 12px;
      }

      .profile-title {
        font-size: 2rem;
      }

      .profile-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .profile-card {
        padding: 24px 20px;
      }

      .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfilePage implements OnInit {
  // Mock data para el perfil
  userProfile = signal<MockUserProfile>({
    fullName: 'Juan Carlos Pérez',
    email: 'juan.perez@example.com',
    phone: '+57 300 123 4567',
    addresses: [
      {
        label: 'Casa',
        line1: 'Calle 123 #45-67',
        city: 'Bogotá',
        country: 'Colombia'
      },
      {
        label: 'Trabajo',
        line1: 'Carrera 15 #32-18',
        city: 'Bogotá',
        country: 'Colombia'
      }
    ],
    cards: [
      {
        brand: 'Visa',
        last4: '1234',
        holder: 'JUAN C PEREZ'
      },
      {
        brand: 'Mastercard',
        last4: '5678',
        holder: 'JUAN C PEREZ'
      }
    ]
  });

  profileCards = signal<ProfileCard[]>([
    {
      id: 'personal',
      title: 'Información personal',
      description: 'Actualiza tu nombre, teléfono y datos básicos',
      icon: '👤',
      route: '/profile/personal'
    },
    {
      id: 'account',
      title: 'Datos de tu cuenta',
      description: 'Gestiona tu email y configuración de cuenta',
      icon: '⚙️',
      route: '/profile/account'
    },
    {
      id: 'security',
      title: 'Seguridad',
      description: 'Cambia tu contraseña y configuración de seguridad',
      icon: '🔒',
      route: '/profile/security'
    },
    {
      id: 'cards',
      title: 'Tarjetas',
      description: 'Administra tus métodos de pago y tarjetas',
      icon: '💳',
      route: '/profile/cards'
    },
    {
      id: 'addresses',
      title: 'Direcciones',
      description: 'Gestiona tus direcciones de envío y facturación',
      icon: '📍',
      route: '/profile/addresses'
    },
    {
      id: 'purchases',
      title: 'Mis compras',
      description: 'Revisa tu historial de compras y pedidos',
      icon: '📦',
      route: '/profile/purchases'
    }
  ]);

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Verificar si hay una sección favorita guardada
    const lastTab = localStorage.getItem('agromarket:lastProfileTab');
    if (lastTab) {
      // Destacar la última sección visitada
      this.highlightCard(lastTab);
    }
  }

  navigateToSection(route: string): void {
    // Guardar la última sección visitada
    const sectionId = route.split('/').pop();
    if (sectionId) {
      localStorage.setItem('agromarket:lastProfileTab', sectionId);
    }
    
    this.router.navigate([route]);
  }

  private highlightCard(cardId: string): void {
    // Esta función podría usarse para destacar visualmente la última card visitada
    // Por ahora solo registramos el evento
    console.log(`Última sección visitada: ${cardId}`);
  }
}