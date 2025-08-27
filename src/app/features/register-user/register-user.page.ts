/**
 * Página de registro de usuarios para AgroMarket
 * 
 * @description Componente que maneja el formulario de registro de nuevos usuarios
 * en el sistema. Incluye validación reactiva, consumo del endpoint de tipos de
 * documento para información visual, y llamada al API de creación de usuarios.
 * 
 * Funcionalidades principales:
 * - Formulario reactivo con validaciones básicas
 * - Consulta GET /api/TipoDocumento para mostrar información visual
 * - Envío POST /api/CrearUsuario con los datos del formulario
 * - Dialogs de confirmación y error en español
 * - Navegación automática al login tras registro exitoso
 * 
 * Consideraciones importantes:
 * - Los tipos de documento son solo informativos, no se envían en el POST
 * - Cada input tiene id único y label asociado para accesibilidad
 * - El formulario se deshabilita durante el envío
 * - Todos los mensajes están en español
 * 
 * @author AgroMarket Team
 * @since 1.0.0
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { UserApiService } from '../../core/services/user/user.api';
import { CrearUsuarioRequest } from '../../core/models/crear-usuario.model';
import { TipoDocumento } from '../../core/models/tipo-documento.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

/**
 * Componente standalone para el registro de nuevos usuarios
 * 
 * @description Permite a los usuarios crear una nueva cuenta en AgroMarket
 * mediante un formulario reactivo. Muestra información de tipos de documento
 * como referencia y maneja la comunicación con la API para crear el usuario.
 */
@Component({
  selector: 'app-register-user',
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './register-user.page.html',
  styleUrl: './register-user.page.css'
})
export class RegisterUserPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userApiService = inject(UserApiService);
  readonly router = inject(Router);

  /** Formulario reactivo para el registro de usuario */
  registerForm!: FormGroup;
  
  /** Lista de tipos de documento disponibles (solo visual) */
  tiposDocumento = signal<TipoDocumento[]>([]);
  
  /** Indica si se están cargando los tipos de documento */
  cargandoTipos = signal<boolean>(true);
  
  /** Indica si el formulario se está enviando */
  enviandoFormulario = signal<boolean>(false);
  
  /** Controla la visibilidad del dialog de confirmación */
  mostrarDialogExito = signal<boolean>(false);
  
  /** Controla la visibilidad del dialog de error */
  mostrarDialogError = signal<boolean>(false);
  
  /** Mensaje de error para mostrar en el dialog */
  mensajeError = signal<string>('');

  /**
   * Inicializa el componente
   * 
   * @description Se ejecuta al cargar el componente. Inicializa el formulario
   * reactivo y carga la lista de tipos de documento desde la API.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarTiposDocumento();
  }

  /**
   * Configura el formulario reactivo sin validaciones
   * 
   * @description Crea el FormGroup con todos los campos requeridos para el registro
   * de usuario, sin aplicar validaciones para permitir envío en cualquier estado.
   * 
   * @private
   */
  private inicializarFormulario(): void {
    this.registerForm = this.formBuilder.group({
      Email: [''],
      Nombre: [''],
      Apellido: [''],
      Telefono: [''],
      Direccion: [''],
      Documento: [''],
      Password: [''],
      TipoDocumento: [''] // Nuevo campo para el dropdown (opcional, no se envía en POST)
    });
  }

  /**
   * Carga los tipos de documento desde la API
   * 
   * @description Realiza una petición GET al endpoint /api/TipoDocumento para
   * obtener la lista de tipos disponibles. Esta información se muestra como
   * referencia visual para el usuario pero no se incluye en el registro.
   * 
   * @private
   */
  private cargarTiposDocumento(): void {
    this.cargandoTipos.set(true);
    
    this.userApiService.listarTiposDocumento()
      .pipe(
        finalize(() => this.cargandoTipos.set(false))
      )
      .subscribe({
        next: (tipos) => {
          this.tiposDocumento.set(tipos);
        },
        error: (error) => {
          console.error('Error al cargar tipos de documento:', error);
          // No mostramos error al usuario por ser información solo visual
        }
      });
  }

  /**
   * Maneja el envío del formulario de registro
   * 
   * @description Envía los datos del formulario al endpoint de creación
   * de usuario. El botón está siempre habilitado para permitir envío
   * sin validaciones previas.
   * 
   * @returns {void}
   */
  onSubmit(): void {
    this.enviandoFormulario.set(true);
    
    // Extraer solo los campos que van en el POST (sin TipoDocumento)
    const { TipoDocumento, ...userData } = this.registerForm.value;
    const crearUsuarioData: CrearUsuarioRequest = userData;

    this.userApiService.crearUsuario(crearUsuarioData)
      .pipe(
        finalize(() => this.enviandoFormulario.set(false))
      )
      .subscribe({
        next: (response) => {
          console.log('Usuario creado exitosamente:', response);
          this.mostrarDialogExito.set(true);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          this.manejarErrorCreacion(error);
        }
      });
  }

  /**
   * Maneja los errores de creación de usuario
   * 
   * @description Procesa la respuesta de error del servidor y prepara un mensaje
   * apropiado para mostrar al usuario en el dialog de error.
   * 
   * @param {any} error - Error recibido del servidor
   * @private
   */
  private manejarErrorCreacion(error: any): void {
    let mensaje = 'Error al crear el usuario';
    
    if (error.status) {
      mensaje += ` (Código: ${error.status})`;
    }
    
    if (error.error?.message) {
      mensaje += `: ${error.error.message}`;
    } else if (error.message) {
      mensaje += `: ${error.message}`;
    }
    
    this.mensajeError.set(mensaje);
    this.mostrarDialogError.set(true);
  }

  /**
   * Maneja la confirmación del dialog de éxito
   * 
   * @description Se ejecuta cuando el usuario hace clic en "Aceptar" en el dialog
   * de registro exitoso. Cierra el dialog y navega a la página de login.
   */
  onConfirmarExito(): void {
    this.mostrarDialogExito.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Maneja la confirmación del dialog de error
   * 
   * @description Se ejecuta cuando el usuario hace clic en "Aceptar" en el dialog
   * de error. Simplemente cierra el dialog para permitir que el usuario reintente.
   */
  onConfirmarError(): void {
    this.mostrarDialogError.set(false);
  }

  /**
   * Formatea un tipo de documento para mostrar
   * 
   * @description Crea la representación visual de un tipo de documento
   * concatenando su sigla y descripción según el formato requerido.
   * 
   * @param {TipoDocumento} tipo - Tipo de documento a formatear
   * @returns {string} Texto formateado "SIGLA - Descripción"
   */
  formatearTipoDocumento(tipo: TipoDocumento): string {
    return `${tipo.sigla} - ${tipo.descripcion}`;
  }
}
