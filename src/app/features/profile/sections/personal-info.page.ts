/**
 * Página de información personal - AgroMarket Profile
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="personal-info-container">
      <div class="breadcrumb">
        <button class="agro-outline" (click)="goBack()">← Volver al perfil</button>
      </div>

      <header class="page-header">
        <h1>Información Personal</h1>
        <p>Actualiza tu información personal básica</p>
      </header>

      <form [formGroup]="personalForm" (ngSubmit)="onSave()" class="personal-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="inpFullName">Nombre completo *</label>
            <input 
              id="inpFullName"
              type="text" 
              formControlName="fullName"
              class="form-input"
              placeholder="Ingresa tu nombre completo"
            >
            <div class="error-message" *ngIf="personalForm.get('fullName')?.errors?.['required'] && personalForm.get('fullName')?.touched">
              El nombre es requerido
            </div>
          </div>

          <div class="form-group">
            <label for="inpPhone">Teléfono *</label>
            <input 
              id="inpPhone"
              type="tel" 
              formControlName="phone"
              class="form-input"
              placeholder="+57 300 123 4567"
            >
            <div class="error-message" *ngIf="personalForm.get('phone')?.errors?.['required'] && personalForm.get('phone')?.touched">
              El teléfono es requerido
            </div>
          </div>

          <div class="form-group">
            <label for="inpBirthDate">Fecha de nacimiento</label>
            <input 
              id="inpBirthDate"
              type="date" 
              formControlName="birthDate"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label for="inpGender">Género</label>
            <select id="inpGender" formControlName="gender" class="form-input">
              <option value="">Seleccionar</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
              <option value="prefer-not-to-say">Prefiero no decir</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label for="inpBio">Biografía</label>
            <textarea 
              id="inpBio"
              formControlName="bio"
              class="form-input"
              rows="4"
              placeholder="Cuéntanos algo sobre ti (opcional)"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="agro-outline" (click)="onCancel()">
            Cancelar
          </button>
          <button 
            type="submit" 
            class="agro-primary"
            id="btnEditPersonal"
            [disabled]="personalForm.invalid || isLoading()"
          >
            <span *ngIf="isLoading()">Guardando...</span>
            <span *ngIf="!isLoading()">Guardar cambios</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .personal-info-container {
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

    .personal-form {
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

    .form-group.full-width {
      grid-column: 1 / -1;
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

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 4px;
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
export class PersonalInfoPage {
  isLoading = signal(false);
  personalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.personalForm = this.fb.group({
      fullName: ['Juan Carlos Pérez', [Validators.required, Validators.minLength(2)]],
      phone: ['+57 300 123 4567', [Validators.required]],
      birthDate: ['1990-05-15'],
      gender: ['male'],
      bio: ['Agricultor apasionado por productos orgánicos y sostenibilidad.']
    });
  }

  onSave(): void {
    if (this.personalForm.valid) {
      this.isLoading.set(true);
      
      // Simular guardado
      setTimeout(() => {
        this.isLoading.set(false);
        alert('Información personal actualizada correctamente');
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