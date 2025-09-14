import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.css'
})
export class ForgotPasswordPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Señales para el estado del componente
  isSubmitting = signal(false);
  showMessage = signal('');
  showError = signal('');

  // Formulario reactivo
  forgotPasswordForm: FormGroup;

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Maneja el envío del formulario de recuperación de contraseña
   */
  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.showError.set('');

      try {
        const email = this.forgotPasswordForm.get('email')?.value;
        
        // Simulación de llamada a API
        await this.simulateApiCall(email);
        
        this.showMessage.set('Se ha enviado un enlace de recuperación a tu correo electrónico.');
        this.forgotPasswordForm.reset();
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
        
      } catch (error: any) {
        console.error('Error en recuperación de contraseña:', error);
        this.showError.set('Error al enviar el enlace de recuperación. Intenta nuevamente.');
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Simulación de llamada a API
   */
  private async simulateApiCall(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular éxito en la mayoría de casos
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Error simulado'));
        }
      }, 1500);
    });
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldError(fieldName: string): string {
    const field = this.forgotPasswordForm.get(fieldName);
    
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (field.errors['email']) {
        return 'Ingresa un correo electrónico válido';
      }
    }
    
    return '';
  }
}