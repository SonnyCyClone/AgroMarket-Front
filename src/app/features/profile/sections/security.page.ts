/**
 * Página de seguridad - AgroMarket Profile
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="security-container">
      <div class="breadcrumb">
        <button class="agro-outline" (click)="goBack()">← Volver al perfil</button>
      </div>

      <header class="page-header">
        <h1>Seguridad</h1>
        <p>Gestiona tu contraseña y configuración de seguridad</p>
      </header>

      <div class="security-sections">
        <!-- Cambio de contraseña -->
        <div class="security-card">
          <h3>Cambiar contraseña</h3>
          <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="password-form">
            <div class="form-group">
              <label for="inpCurrentPassword">Contraseña actual *</label>
              <input 
                id="inpCurrentPassword"
                type="password" 
                formControlName="currentPassword"
                class="form-input"
                placeholder="Ingresa tu contraseña actual"
              >
            </div>

            <div class="form-group">
              <label for="inpNewPassword">Nueva contraseña *</label>
              <input 
                id="inpNewPassword"
                type="password" 
                formControlName="newPassword"
                class="form-input"
                placeholder="Mínimo 8 caracteres"
              >
              <div class="password-strength" *ngIf="passwordForm.get('newPassword')?.value">
                <div class="strength-indicator" [class]="getPasswordStrength()"></div>
                <span class="strength-text">{{ getPasswordStrengthText() }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="inpConfirmPassword">Confirmar nueva contraseña *</label>
              <input 
                id="inpConfirmPassword"
                type="password" 
                formControlName="confirmPassword"
                class="form-input"
                placeholder="Confirma tu nueva contraseña"
              >
              <div class="error-message" *ngIf="passwordForm.get('confirmPassword')?.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched">
                Las contraseñas no coinciden
              </div>
            </div>

            <button 
              type="submit" 
              class="agro-primary"
              id="btnChangePassword"
              [disabled]="passwordForm.invalid || isLoadingPassword()"
            >
              <span *ngIf="isLoadingPassword()">Cambiando...</span>
              <span *ngIf="!isLoadingPassword()">Cambiar contraseña</span>
            </button>
          </form>
        </div>

        <!-- Autenticación de dos factores -->
        <div class="security-card">
          <h3>Autenticación de dos factores (2FA)</h3>
          <p class="card-description">
            Agrega una capa extra de seguridad a tu cuenta
          </p>
          
          <div class="two-factor-status" [class.enabled]="twoFactorEnabled()">
            <div class="status-indicator">
              <span class="status-icon">{{ twoFactorEnabled() ? '🔒' : '🔓' }}</span>
              <div class="status-text">
                <strong>{{ twoFactorEnabled() ? 'Activada' : 'Desactivada' }}</strong>
                <p>{{ twoFactorEnabled() ? 'Tu cuenta está protegida con 2FA' : 'Tu cuenta no tiene 2FA activado' }}</p>
              </div>
            </div>
            
            <button 
              class="agro-outline"
              id="btnToggle2FA"
              (click)="toggleTwoFactor()"
              [disabled]="isLoading2FA()"
            >
              <span *ngIf="isLoading2FA()">Procesando...</span>
              <span *ngIf="!isLoading2FA()">{{ twoFactorEnabled() ? 'Desactivar' : 'Activar' }}</span>
            </button>
          </div>
        </div>

        <!-- Sesiones activas -->
        <div class="security-card">
          <h3>Sesiones activas</h3>
          <p class="card-description">
            Administra los dispositivos donde tienes sesión iniciada
          </p>
          
          <div class="sessions-list">
            <div *ngFor="let session of activeSessions()" class="session-item">
              <div class="session-info">
                <div class="session-device">
                  <span class="device-icon">{{ session.deviceIcon }}</span>
                  <div class="device-details">
                    <strong>{{ session.deviceName }}</strong>
                    <p>{{ session.location }} • {{ session.lastActive }}</p>
                  </div>
                </div>
                <span class="current-session" *ngIf="session.isCurrent">Sesión actual</span>
              </div>
              
              <button 
                class="agro-outline small"
                *ngIf="!session.isCurrent"
                (click)="revokeSession(session.id)"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .security-container {
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

    .security-sections {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .security-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .security-card h3 {
      color: var(--agro-text);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .card-description {
      color: var(--agro-muted);
      margin: 0 0 24px 0;
    }

    .password-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
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

    .password-strength {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }

    .strength-indicator {
      height: 4px;
      width: 100px;
      border-radius: 2px;
      background: #e5e7eb;
    }

    .strength-indicator.weak {
      background: #dc3545;
      width: 30%;
    }

    .strength-indicator.medium {
      background: #ffc107;
      width: 60%;
    }

    .strength-indicator.strong {
      background: var(--agro-green-400);
      width: 100%;
    }

    .strength-text {
      font-size: 0.875rem;
      color: var(--agro-muted);
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
    }

    .two-factor-status {
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .two-factor-status.enabled {
      border-color: var(--agro-green-400);
      background: var(--agro-green-50);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .status-icon {
      font-size: 2rem;
    }

    .status-text strong {
      color: var(--agro-text);
      display: block;
      margin-bottom: 4px;
    }

    .status-text p {
      color: var(--agro-muted);
      margin: 0;
      font-size: 0.9rem;
    }

    .sessions-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .session-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .session-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .session-device {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .device-icon {
      font-size: 1.5rem;
    }

    .device-details strong {
      color: var(--agro-text);
      display: block;
    }

    .device-details p {
      color: var(--agro-muted);
      margin: 0;
      font-size: 0.875rem;
    }

    .current-session {
      background: var(--agro-green-50);
      color: var(--agro-green-500);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .agro-outline.small {
      padding: 8px 12px;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .two-factor-status {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .session-item {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
    }
  `]
})
export class SecurityPage {
  isLoadingPassword = signal(false);
  isLoading2FA = signal(false);
  twoFactorEnabled = signal(false);
  
  passwordForm: FormGroup;

  activeSessions = signal([
    {
      id: '1',
      deviceName: 'Chrome en Windows',
      deviceIcon: '💻',
      location: 'Bogotá, Colombia',
      lastActive: 'Activa ahora',
      isCurrent: true
    },
    {
      id: '2',
      deviceName: 'Safari en iPhone',
      deviceIcon: '📱',
      location: 'Bogotá, Colombia',
      lastActive: 'Hace 2 horas',
      isCurrent: false
    },
    {
      id: '3',
      deviceName: 'Chrome en Android',
      deviceIcon: '📱',
      location: 'Medellín, Colombia',
      lastActive: 'Hace 1 día',
      isCurrent: false
    }
  ]);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
    }
    return null;
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoadingPassword.set(true);
      
      setTimeout(() => {
        this.isLoadingPassword.set(false);
        alert('Contraseña cambiada correctamente');
        this.passwordForm.reset();
      }, 2000);
    }
  }

  toggleTwoFactor(): void {
    this.isLoading2FA.set(true);
    
    setTimeout(() => {
      this.twoFactorEnabled.set(!this.twoFactorEnabled());
      this.isLoading2FA.set(false);
      
      const action = this.twoFactorEnabled() ? 'activado' : 'desactivado';
      alert(`2FA ${action} correctamente`);
    }, 1500);
  }

  revokeSession(sessionId: string): void {
    const sessions = this.activeSessions();
    const updated = sessions.filter(s => s.id !== sessionId);
    this.activeSessions.set(updated);
    alert('Sesión cerrada correctamente');
  }

  getPasswordStrength(): string {
    const password = this.passwordForm.get('newPassword')?.value || '';
    
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    const texts = {
      weak: 'Débil',
      medium: 'Media',
      strong: 'Fuerte'
    };
    return texts[strength as keyof typeof texts];
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}