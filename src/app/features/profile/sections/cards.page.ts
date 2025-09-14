/**
 * Página de tarjetas - AgroMarket Profile
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  lastFourDigits: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="cards-container">
      <div class="breadcrumb">
        <button class="agro-outline" (click)="goBack()">← Volver al perfil</button>
      </div>

      <header class="page-header">
        <h1>Tarjetas</h1>
        <p>Gestiona tus métodos de pago guardados</p>
      </header>

      <div class="cards-content">
        <!-- Lista de tarjetas -->
        <div class="cards-section">
          <div class="section-header">
            <h3>Mis tarjetas</h3>
            <button 
              class="agro-primary"
              id="btnAddCard"
              (click)="showAddCardForm()"
            >
              + Agregar tarjeta
            </button>
          </div>

          <div class="cards-grid" *ngIf="cards().length > 0">
            <div *ngFor="let card of cards()" class="card-item">
              <div class="card-visual" [class]="card.type">
                <div class="card-header">
                  <div class="card-logo">
                    <span *ngIf="card.type === 'visa'">VISA</span>
                    <span *ngIf="card.type === 'mastercard'">MC</span>
                    <span *ngIf="card.type === 'amex'">AMEX</span>
                  </div>
                  <div class="card-actions">
                    <button 
                      class="card-action"
                      [class.active]="card.isDefault"
                      (click)="setDefaultCard(card.id)"
                      title="Marcar como predeterminada"
                    >
                      {{ card.isDefault ? '★' : '☆' }}
                    </button>
                  </div>
                </div>
                
                <div class="card-number">
                  •••• •••• •••• {{ card.lastFourDigits }}
                </div>
                
                <div class="card-info">
                  <div class="card-holder">{{ card.holderName }}</div>
                  <div class="card-expiry">{{ card.expiryMonth }}/{{ card.expiryYear }}</div>
                </div>
                
                <div class="card-badge" *ngIf="card.isDefault">
                  Predeterminada
                </div>
              </div>
              
              <div class="card-controls">
                <button 
                  class="agro-outline small"
                  (click)="editCard(card)"
                >
                  Editar
                </button>
                <button 
                  class="card-remove"
                  (click)="removeCard(card.id)"
                  [disabled]="card.isDefault"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="cards().length === 0">
            <div class="empty-icon">💳</div>
            <h4>No tienes tarjetas guardadas</h4>
            <p>Agrega una tarjeta para realizar pagos más rápidos</p>
            <button 
              class="agro-primary"
              (click)="showAddCardForm()"
            >
              Agregar mi primera tarjeta
            </button>
          </div>
        </div>

        <!-- Formulario para agregar/editar tarjeta -->
        <div class="add-card-form" *ngIf="showingForm()">
          <h3>{{ isEditing() ? 'Editar tarjeta' : 'Agregar nueva tarjeta' }}</h3>
          
          <form [formGroup]="cardForm" (ngSubmit)="onSubmitCard()" class="card-form">
            <div class="form-row">
              <div class="form-group">
                <label for="inpCardNumber">Número de tarjeta *</label>
                <input 
                  id="inpCardNumber"
                  type="text" 
                  formControlName="cardNumber"
                  class="form-input"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  (input)="formatCardNumber($event)"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="inpCardHolder">Nombre del titular *</label>
                <input 
                  id="inpCardHolder"
                  type="text" 
                  formControlName="holderName"
                  class="form-input"
                  placeholder="Como aparece en la tarjeta"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="inpExpMonth">Mes de vencimiento *</label>
                <select 
                  id="inpExpMonth"
                  formControlName="expiryMonth"
                  class="form-input"
                >
                  <option value="">Mes</option>
                  <option *ngFor="let month of months" [value]="month.value">
                    {{ month.label }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="inpExpYear">Año de vencimiento *</label>
                <select 
                  id="inpExpYear"
                  formControlName="expiryYear"
                  class="form-input"
                >
                  <option value="">Año</option>
                  <option *ngFor="let year of years" [value]="year">
                    {{ year }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="inpCvv">CVV *</label>
                <input 
                  id="inpCvv"
                  type="text" 
                  formControlName="cvv"
                  class="form-input"
                  placeholder="123"
                  maxlength="4"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    formControlName="isDefault"
                    id="chkDefaultCard"
                  >
                  <span class="checkmark"></span>
                  Establecer como tarjeta predeterminada
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                class="agro-outline"
                (click)="cancelForm()"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="agro-primary"
                id="btnSaveCard"
                [disabled]="cardForm.invalid || isLoading()"
              >
                <span *ngIf="isLoading()">Guardando...</span>
                <span *ngIf="!isLoading()">{{ isEditing() ? 'Actualizar' : 'Agregar' }} tarjeta</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cards-container {
      max-width: 900px;
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

    .cards-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h3 {
      color: var(--agro-text);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .card-item {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card-visual {
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      border-radius: 12px;
      padding: 20px;
      color: white;
      margin-bottom: 16px;
      position: relative;
      min-height: 150px;
    }

    .card-visual.visa {
      background: linear-gradient(135deg, #1e40af, #3b82f6);
    }

    .card-visual.mastercard {
      background: linear-gradient(135deg, #dc2626, #ef4444);
    }

    .card-visual.amex {
      background: linear-gradient(135deg, #059669, #10b981);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .card-logo {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .card-action {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .card-action:hover,
    .card-action.active {
      opacity: 1;
    }

    .card-number {
      font-size: 1.2rem;
      font-family: monospace;
      margin-bottom: 20px;
      letter-spacing: 2px;
    }

    .card-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .card-holder {
      font-size: 0.9rem;
      text-transform: uppercase;
    }

    .card-expiry {
      font-size: 0.9rem;
      font-family: monospace;
    }

    .card-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      backdrop-filter: blur(10px);
    }

    .card-controls {
      display: flex;
      gap: 12px;
    }

    .card-remove {
      background: none;
      border: 1px solid #dc3545;
      color: #dc3545;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .card-remove:hover:not(:disabled) {
      background: #dc3545;
      color: white;
    }

    .card-remove:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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

    .add-card-form {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .add-card-form h3 {
      color: var(--agro-text);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 24px 0;
    }

    .card-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .form-row:has(.form-group:nth-child(3)) {
      grid-template-columns: 1fr 1fr 100px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 600;
      color: var(--agro-text);
      font-size: 0.95rem;
    }

    .form-input {
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--agro-green-400);
      box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.25);
    }

    .checkbox-group {
      flex-direction: row;
      align-items: center;
      gap: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-weight: 400;
    }

    .checkbox-label input[type="checkbox"] {
      display: none;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid #e5e7eb;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark {
      background: var(--agro-green-400);
      border-color: var(--agro-green-400);
    }

    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
      content: '✓';
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .agro-outline.small {
      padding: 8px 12px;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .form-row:has(.form-group:nth-child(3)) {
        grid-template-columns: 1fr;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CardsPage {
  isLoading = signal(false);
  showingForm = signal(false);
  isEditing = signal(false);
  editingCardId = signal<string | null>(null);

  cards = signal<PaymentCard[]>([
    {
      id: '1',
      type: 'visa',
      lastFourDigits: '4532',
      expiryMonth: '12',
      expiryYear: '2026',
      holderName: 'Juan Pérez García',
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      lastFourDigits: '8765',
      expiryMonth: '08',
      expiryYear: '2025',
      holderName: 'Juan Pérez García',
      isDefault: false
    }
  ]);

  cardForm: FormGroup;

  months = [
    { value: '01', label: '01 - Enero' },
    { value: '02', label: '02 - Febrero' },
    { value: '03', label: '03 - Marzo' },
    { value: '04', label: '04 - Abril' },
    { value: '05', label: '05 - Mayo' },
    { value: '06', label: '06 - Junio' },
    { value: '07', label: '07 - Julio' },
    { value: '08', label: '08 - Agosto' },
    { value: '09', label: '09 - Septiembre' },
    { value: '10', label: '10 - Octubre' },
    { value: '11', label: '11 - Noviembre' },
    { value: '12', label: '12 - Diciembre' }
  ];

  years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + i);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      holderName: ['', [Validators.required, Validators.minLength(2)]],
      expiryMonth: ['', [Validators.required]],
      expiryYear: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      isDefault: [false]
    });
  }

  showAddCardForm(): void {
    this.showingForm.set(true);
    this.isEditing.set(false);
    this.editingCardId.set(null);
    this.cardForm.reset();
  }

  editCard(card: PaymentCard): void {
    this.showingForm.set(true);
    this.isEditing.set(true);
    this.editingCardId.set(card.id);
    
    this.cardForm.patchValue({
      cardNumber: `**** **** **** ${card.lastFourDigits}`,
      holderName: card.holderName,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      isDefault: card.isDefault
    });
  }

  cancelForm(): void {
    this.showingForm.set(false);
    this.isEditing.set(false);
    this.editingCardId.set(null);
    this.cardForm.reset();
  }

  onSubmitCard(): void {
    if (this.cardForm.valid) {
      this.isLoading.set(true);
      
      setTimeout(() => {
        const formValue = this.cardForm.value;
        
        if (this.isEditing()) {
          // Lógica de edición
          alert('Tarjeta actualizada correctamente');
        } else {
          // Lógica de creación
          const newCard: PaymentCard = {
            id: Date.now().toString(),
            type: this.detectCardType(formValue.cardNumber),
            lastFourDigits: formValue.cardNumber.slice(-4),
            expiryMonth: formValue.expiryMonth,
            expiryYear: formValue.expiryYear,
            holderName: formValue.holderName,
            isDefault: formValue.isDefault
          };
          
          const currentCards = this.cards();
          if (newCard.isDefault) {
            currentCards.forEach(card => card.isDefault = false);
          }
          
          this.cards.set([...currentCards, newCard]);
          alert('Tarjeta agregada correctamente');
        }
        
        this.isLoading.set(false);
        this.cancelForm();
      }, 2000);
    }
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue !== event.target.value) {
      event.target.value = formattedValue;
      this.cardForm.get('cardNumber')?.setValue(formattedValue);
    }
  }

  detectCardType(cardNumber: string): 'visa' | 'mastercard' | 'amex' {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'visa';
  }

  setDefaultCard(cardId: string): void {
    const updated = this.cards().map(card => ({
      ...card,
      isDefault: card.id === cardId
    }));
    this.cards.set(updated);
    alert('Tarjeta establecida como predeterminada');
  }

  removeCard(cardId: string): void {
    const card = this.cards().find(c => c.id === cardId);
    if (card?.isDefault) {
      alert('No puedes eliminar la tarjeta predeterminada');
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      const updated = this.cards().filter(c => c.id !== cardId);
      this.cards.set(updated);
      alert('Tarjeta eliminada correctamente');
    }
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}