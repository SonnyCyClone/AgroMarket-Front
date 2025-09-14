/**
 * Página de datos de cuenta - AgroMarket Profile
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="account-data-container">
      <div class="breadcrumb">
        <button class="agro-outline" (click)="goBack()">← Volver al perfil</button>
      </div>

      <header class="page-header">
        <h1>Datos de tu Cuenta</h1>
        <p>Gestiona tu email y configuración de cuenta</p>
      </header>

      <form [formGroup]="accountForm" (ngSubmit)="onSave()" class="account-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="inpEmail">Email *</label>
            <input 
              id="inpEmail"
              type="email" 
              formControlName="email"
              class="form-input"
              placeholder="tu@email.com"
            >
            <div class="error-message" *ngIf="accountForm.get('email')?.errors?.['required'] && accountForm.get('email')?.touched">
              El email es requerido
            </div>
            <div class="error-message" *ngIf="accountForm.get('email')?.errors?.['email'] && accountForm.get('email')?.touched">
              Ingresa un email válido
            </div>
          </div>

          <div class="form-group">
            <label for="inpUsername">Nombre de usuario</label>
            <input 
              id="inpUsername"
              type="text" 
              formControlName="username"
              class="form-input"
              placeholder="usuario123"
            >
            <small class="help-text">Este será tu identificador único en AgroMarket</small>
          </div>

          <div class="form-group">
            <label for="selLanguage">Idioma preferido</label>
            <select id="selLanguage" formControlName="language" class="form-input">
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div class="form-group">
            <label for="selTimezone">Zona horaria</label>
            <select id="selTimezone" formControlName="timezone" class="form-input">
              <option value="America/Bogota">Bogotá (GMT-5)</option>
              <option value="America/Caracas">Caracas (GMT-4)</option>
              <option value="America/Lima">Lima (GMT-5)</option>
              <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
            </select>
          </div>
        </div>

        <div class="preferences-section">
          <h3>Preferencias de notificaciones</h3>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="emailNotifications">
              <span class="checkbox-text">Recibir notificaciones por email</span>
            </label>
            
            <label class="checkbox-label">
              <input type="checkbox" formControlName="smsNotifications">
              <span class="checkbox-text">Recibir notificaciones por SMS</span>
            </label>
            
            <label class="checkbox-label">
              <input type="checkbox" formControlName="marketingEmails">
              <span class="checkbox-text">Recibir ofertas y promociones</span>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="agro-outline" (click)="onCancel()">
            Cancelar
          </button>
          <button 
            type="submit" 
            class="agro-primary"
            id="btnEditAccount"
            [disabled]="accountForm.invalid || isLoading()"
          >
            <span *ngIf="isLoading()">Guardando...</span>
            <span *ngIf="!isLoading()">Guardar cambios</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .account-data-container {
      max-width: 800px;
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

    .account-form {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
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

    .help-text {
      color: var(--agro-muted);
      font-size: 0.875rem;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
    }

    .preferences-section {
      background: var(--agro-green-50);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
    }

    .preferences-section h3 {
      color: var(--agro-text);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 16px 0;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--agro-green-400);
    }

    .checkbox-text {
      color: var(--agro-text);
      font-size: 0.95rem;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AccountDataPage {
  isLoading = signal(false);
  accountForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      email: ['juan.perez@email.com', [Validators.required, Validators.email]],
      username: ['jcperez123', [Validators.required, Validators.minLength(3)]],
      language: ['es'],
      timezone: ['America/Bogota'],
      emailNotifications: [true],
      smsNotifications: [false],
      marketingEmails: [true]
    });
  }

  onSave(): void {
    if (this.accountForm.valid) {
      this.isLoading.set(true);
      
      // Simular guardado
      setTimeout(() => {
        this.isLoading.set(false);
        alert('Datos de cuenta actualizados correctamente');
      }, 1500);
    }
  }

  onCancel(): void {
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}