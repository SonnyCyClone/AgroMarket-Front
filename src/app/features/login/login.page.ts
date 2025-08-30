/**
 * Página de inicio de sesión para AgroMarket
 * 
 * @description Componente que maneja el formulario de login con autenticación
 * real contra el API. Incluye manejo de errores 401 y persistencia de sesión.
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
}
