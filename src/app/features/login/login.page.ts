/**
 * Página de inicio de sesión para AgroMarket
 * 
 * @description Componente que maneja el formulario de login con autenticación
 * real contra el API. Incluye manejo de errores 401 y persistencia de sesión.
 * Agregada funcionalidad de recuperación de contraseña mock.
 * 
 * Funcionalidades implementadas:
 * - Formulario reactivo de login con validaciones
 * - Autenticación real contra API de autenticación
 * - Manejo específico de errores 401 (credenciales incorrectas)
 * - Modal de recuperación de contraseña con simulación de envío de email
 * - Validación de formato de email para recuperación
 * - Mensajes de error y éxito contextuales
 * - Redirección automática tras login exitoso
 * - Navegación a página de registro
 * 
 * Elementos QA identificados:
 * - #login-email: Campo de email para autenticación
 * - #login-password: Campo de contraseña
 * - #forgot-password-button: Enlace para abrir modal de recuperación
 * - #login-submit-button: Botón principal de login
 * - #login-register-link-button: Enlace para crear cuenta nueva
 * - #close-forgot-password-modal: Botón para cerrar modal de recuperación
 * - #recovery-email: Campo de email en modal de recuperación
 * - #cancel-recovery-button: Botón cancelar en modal
 * - #send-recovery-button: Botón enviar recuperación
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

/**
 * Componente de login con autenticación real
 * 
 * @description Permite a los usuarios iniciar sesión utilizando el endpoint
 * real del API. Maneja errores 401 y muestra mensajes apropiados.
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage {
  /** Formulario reactivo para las credenciales */
  loginForm: FormGroup;
  
  /** Mensaje de error para mostrar al usuario */
  errorMessage = '';
  
  /** Indica si se está procesando el login */
  isLoading = false;
  
  /** Controla la visibilidad del mensaje de error 401 */
  showUnauthorizedError = false;

  /** Controla la visibilidad del modal de recuperación de contraseña */
  showForgotPasswordDialog = false;
  
  /** Email para recuperación de contraseña */
  forgotPasswordEmail = '';
  
  /** Estado del envío de recuperación */
  isSendingRecovery = false;
  
  /** Mensaje de éxito para recuperación */
  recoverySuccessMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      this.showUnauthorizedError = false;

      const { email, password } = this.loginForm.value;

      this.authService.loginReal(email, password).subscribe({
        next: (response) => {
          // Login exitoso - navegar al home
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          
          // Manejar error 401 específicamente
          if (error.status === 401) {
            this.showUnauthorizedError = true;
            this.errorMessage = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
          } else {
            // Otros errores del servidor
            this.errorMessage = 'Error del servidor. Por favor, inténtalo de nuevo más tarde.';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (control.errors['email']) return 'Por favor ingresa un email válido';
      if (control.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: {[key: string]: string} = {
      'email': 'Email',
      'password': 'Contraseña'
    };
    return labels[fieldName] || fieldName;
  }

  goToRegister(): void {
    this.router.navigate(['/register-user']);
  }

  clearError(): void {
    this.errorMessage = '';
  }

  /**
   * Oculta el mensaje de error 401
   */
  hideUnauthorizedError(): void {
    this.showUnauthorizedError = false;
    this.errorMessage = '';
  }

  /**
   * Abre el diálogo de recuperación de contraseña
   */
  openForgotPasswordDialog(): void {
    this.showForgotPasswordDialog = true;
    this.forgotPasswordEmail = this.loginForm.get('email')?.value || '';
    this.recoverySuccessMessage = '';
    this.errorMessage = '';
  }

  /**
   * Cierra el diálogo de recuperación de contraseña
   */
  closeForgotPasswordDialog(): void {
    this.showForgotPasswordDialog = false;
    this.forgotPasswordEmail = '';
    this.recoverySuccessMessage = '';
    this.isSendingRecovery = false;
  }

  /**
   * Simula el envío de email de recuperación
   * @description Implementación mock que simula el proceso de recuperación
   */
  sendPasswordRecovery(): void {
    if (!this.forgotPasswordEmail || !this.isValidEmail(this.forgotPasswordEmail)) {
      this.errorMessage = 'Por favor ingresa un email válido.';
      return;
    }

    this.isSendingRecovery = true;
    this.errorMessage = '';

    // Simular llamada al API con delay
    setTimeout(() => {
      this.isSendingRecovery = false;
      this.recoverySuccessMessage = `Se ha enviado un enlace de recuperación a ${this.forgotPasswordEmail}. Revisa tu bandeja de entrada y spam.`;
      
      // Auto-cerrar después de mostrar el mensaje
      setTimeout(() => {
        this.closeForgotPasswordDialog();
      }, 3000);
    }, 2000);
  }

  /**
   * Valida si un email tiene formato correcto
   * @param email Email a validar
   * @returns true si el email es válido
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
