/**
 * Página de preguntas frecuentes - AgroMarket
 */

import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="faq-container">
      <header class="faq-header">
        <h1>Preguntas Frecuentes</h1>
        <p>Encuentra respuestas a las preguntas más comunes sobre AgroMarket</p>
      </header>

      <!-- Buscador -->
      <div class="search-section">
        <div class="search-input-container">
          <input 
            type="text" 
            placeholder="Buscar en preguntas frecuentes..." 
            [(ngModel)]="searchTerm"
            id="inpFaqSearch"
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <!-- Filtros por categoría -->
      <div class="category-filters">
        <button 
          *ngFor="let category of categories" 
          class="category-btn"
          [class.active]="selectedCategory() === category"
          (click)="setCategory(category)"
        >
          {{ category }}
        </button>
      </div>

      <!-- Lista de FAQs -->
      <div class="faq-list" *ngIf="filteredFAQs().length > 0">
        <div *ngFor="let faq of filteredFAQs()" class="faq-item">
          <button 
            class="faq-question"
            [class.open]="faq.isOpen"
            (click)="toggleFAQ(faq.id)"
          >
            <span class="question-text">{{ faq.question }}</span>
            <span class="toggle-icon">{{ faq.isOpen ? '−' : '+' }}</span>
          </button>
          
          <div class="faq-answer" [class.open]="faq.isOpen">
            <div class="answer-content" [innerHTML]="faq.answer"></div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div class="empty-state" *ngIf="filteredFAQs().length === 0">
        <div class="empty-icon">❓</div>
        <h3>No se encontraron resultados</h3>
        <p>Intenta con otros términos de búsqueda o selecciona una categoría diferente</p>
        <button class="agro-outline" (click)="clearSearch()">
          Limpiar búsqueda
        </button>
      </div>

      <!-- Contacto -->
      <div class="contact-section">
        <h3>¿No encontraste lo que buscabas?</h3>
        <p>Nuestro equipo de soporte está aquí para ayudarte</p>
        <div class="contact-options">
          <a href="/support" class="agro-primary">
            💬 Iniciar chat de soporte
          </a>
          <a href="mailto:soporte@agromarket.com" class="agro-outline">
            📧 Enviar email
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .faq-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .faq-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .faq-header h1 {
      color: var(--agro-text);
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 16px 0;
    }

    .faq-header p {
      color: var(--agro-muted);
      font-size: 1.1rem;
      margin: 0;
    }

    .search-section {
      margin-bottom: 32px;
    }

    .search-input-container {
      position: relative;
      max-width: 500px;
      margin: 0 auto;
    }

    .search-input {
      width: 100%;
      padding: 16px 50px 16px 20px;
      border: 2px solid #e5e7eb;
      border-radius: 50px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--agro-green-400);
      box-shadow: 0 4px 12px rgba(32, 201, 151, 0.25);
    }

    .search-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      color: var(--agro-muted);
    }

    .category-filters {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 40px;
    }

    .category-btn {
      padding: 12px 24px;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 25px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--agro-text);
    }

    .category-btn:hover {
      border-color: var(--agro-green-400);
      color: var(--agro-green-500);
    }

    .category-btn.active {
      background: var(--agro-green-500);
      border-color: var(--agro-green-500);
      color: white;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 48px;
    }

    .faq-item {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .faq-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .faq-question {
      width: 100%;
      padding: 20px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--agro-text);
      transition: all 0.2s ease;
    }

    .faq-question:hover {
      background: var(--agro-green-50);
    }

    .faq-question.open {
      background: var(--agro-green-50);
      border-bottom: 1px solid var(--agro-green-200);
    }

    .question-text {
      flex: 1;
      padding-right: 20px;
    }

    .toggle-icon {
      width: 32px;
      height: 32px;
      background: var(--agro-green-500);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: 700;
      transition: transform 0.2s ease;
    }

    .faq-question.open .toggle-icon {
      transform: rotate(180deg);
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .faq-answer.open {
      max-height: 500px;
    }

    .answer-content {
      padding: 20px;
      color: var(--agro-text);
      line-height: 1.6;
      border-top: 1px solid #e5e7eb;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 48px;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: var(--agro-text);
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 12px 0;
    }

    .empty-state p {
      color: var(--agro-muted);
      margin: 0 0 24px 0;
    }

    .contact-section {
      background: linear-gradient(135deg, var(--agro-green-500), var(--agro-green-400));
      color: white;
      padding: 40px;
      border-radius: 16px;
      text-align: center;
    }

    .contact-section h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 12px 0;
    }

    .contact-section p {
      margin: 0 0 24px 0;
      opacity: 0.9;
    }

    .contact-options {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .contact-options a {
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .contact-options .agro-primary {
      background: white;
      color: var(--agro-green-500);
    }

    .contact-options .agro-primary:hover {
      background: #f8f9fa;
      transform: translateY(-2px);
    }

    .contact-options .agro-outline {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .contact-options .agro-outline:hover {
      background: white;
      color: var(--agro-green-500);
    }

    @media (max-width: 768px) {
      .faq-header h1 {
        font-size: 2rem;
      }

      .category-filters {
        flex-direction: column;
        align-items: center;
      }

      .category-btn {
        width: 100%;
        max-width: 300px;
      }

      .contact-options {
        flex-direction: column;
      }

      .contact-options a {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class FaqPage {
  searchTerm = '';
  selectedCategory = signal('Todas');

  categories = [
    'Todas',
    'Cuenta y perfil',
    'Compras y pagos',
    'Envíos',
    'Productos',
    'Soporte técnico'
  ];

  faqs = signal<FAQ[]>([
    {
      id: '1',
      question: '¿Cómo creo una cuenta en AgroMarket?',
      answer: 'Para crear una cuenta, haz clic en "Registrarse" en la parte superior de la página. Completa el formulario con tu información personal y elige si eres comprador o agricultor. Recibirás un email de confirmación para activar tu cuenta.',
      category: 'Cuenta y perfil',
      isOpen: false
    },
    {
      id: '2',
      question: '¿Puedo cambiar mi información de perfil?',
      answer: 'Sí, puedes actualizar tu información en cualquier momento. Ve a tu perfil > Información personal para cambiar tus datos, o a Configuración de cuenta para modificar tu email y preferencias.',
      category: 'Cuenta y perfil',
      isOpen: false
    },
    {
      id: '3',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias y PSE. Todos los pagos son procesados de forma segura con encriptación SSL.',
      category: 'Compras y pagos',
      isOpen: false
    },
    {
      id: '4',
      question: '¿Puedo cancelar mi pedido?',
      answer: 'Puedes cancelar tu pedido mientras esté en estado "Procesando". Una vez que el pedido ha sido enviado, no es posible cancelarlo, pero puedes solicitar una devolución.',
      category: 'Compras y pagos',
      isOpen: false
    },
    {
      id: '5',
      question: '¿Cuánto tiempo tarda la entrega?',
      answer: 'Los tiempos de entrega varían según tu ubicación:<br>• Bogotá: 1-2 días hábiles<br>• Ciudades principales: 2-4 días hábiles<br>• Otras ciudades: 3-7 días hábiles<br><br>Te enviaremos un número de seguimiento para rastrear tu pedido.',
      category: 'Envíos',
      isOpen: false
    },
    {
      id: '6',
      question: '¿Hay costo de envío?',
      answer: 'El envío es gratuito para pedidos superiores a $50.000. Para pedidos menores, el costo de envío varía entre $5.000 y $15.000 dependiendo del tamaño y la ubicación de entrega.',
      category: 'Envíos',
      isOpen: false
    },
    {
      id: '7',
      question: '¿Los productos son orgánicos?',
      answer: 'Tenemos tanto productos orgánicos como convencionales. Los productos orgánicos están claramente marcados con el sello "Orgánico Certificado". Puedes filtrar por productos orgánicos en nuestra búsqueda.',
      category: 'Productos',
      isOpen: false
    },
    {
      id: '8',
      question: '¿Cómo sé si un producto está fresco?',
      answer: 'Trabajamos directamente con agricultores locales para garantizar la frescura. Cada producto muestra la fecha de cosecha y nuestra garantía de frescura de 48 horas. Si no estás satisfecho, te devolvemos el dinero.',
      category: 'Productos',
      isOpen: false
    },
    {
      id: '9',
      question: '¿Puedo vender mis productos en AgroMarket?',
      answer: 'Sí, si eres agricultor puedes registrarte como vendedor. Necesitas completar un proceso de verificación que incluye documentos de identidad y certificados agrícolas. Una vez aprobado, podrás publicar tus productos.',
      category: 'Productos',
      isOpen: false
    },
    {
      id: '10',
      question: 'No puedo acceder a mi cuenta, ¿qué hago?',
      answer: 'Si olvidaste tu contraseña, usa la opción "Olvidé mi contraseña" en la página de login. Si sigues teniendo problemas, contacta nuestro soporte técnico a través del chat o envía un email a soporte@agromarket.com.',
      category: 'Soporte técnico',
      isOpen: false
    },
    {
      id: '11',
      question: '¿El sitio web es seguro?',
      answer: 'Sí, utilizamos las mejores prácticas de seguridad incluyendo encriptación SSL, autenticación de dos factores opcional, y nunca almacenamos información completa de tarjetas de crédito. Nuestros sistemas son auditados regularmente.',
      category: 'Soporte técnico',
      isOpen: false
    }
  ]);

  filteredFAQs = computed(() => {
    let filtered = [...this.faqs()];

    // Filtrar por categoría
    if (this.selectedCategory() !== 'Todas') {
      filtered = filtered.filter(faq => faq.category === this.selectedCategory());
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search)
      );
    }

    return filtered;
  });

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  toggleFAQ(faqId: string): void {
    this.faqs.update(faqs => 
      faqs.map(faq => 
        faq.id === faqId 
          ? { ...faq, isOpen: !faq.isOpen }
          : faq
      )
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedCategory.set('Todas');
  }
}