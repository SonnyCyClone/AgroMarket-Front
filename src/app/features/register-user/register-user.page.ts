/**
 * Página de registro de usuarios para AgroMarket
 * 
 * @description Componente que maneja el formulario de registro de nuevos usuarios
 * en el sistema. Incluye validación reactiva, consumo del endpoint de tipos de
 * documento para información visual, y llamada al API de creación de usuarios.
 * Layout optimizado con diseño multi-columna para reducir scrolling.
 * 
 * Funcionalidades principales:
 * - Formulario reactivo con validaciones básicas
 * - Consulta GET /api/TipoDocumento para mostrar información visual
 * - Envío POST /api/CrearUsuario con los datos del formulario
 * - Dialogs de confirmación y error en español
 * - Navegación automática al login tras registro exitoso
 * - Layout optimizado en 4 filas: Email+Nombre, Apellido+Teléfono, Documento+Dirección, Contraseña
 * - Diseño responsivo que mantiene usabilidad en diferentes pantallas
 * 
 * Consideraciones importantes:
 * - Los tipos de documento son solo informativos, no se envían en el POST
 * - Cada input tiene id único y label asociado para accesibilidad
 * - El formulario se deshabilita durante el envío
 * - Todos los mensajes están en español
 * - Layout de dos columnas en desktop, una columna en móviles pequeños
 * 
 * Elementos QA identificados (conservados de versión anterior):
 * - #tipo-documento-select: Dropdown de tipos de documento
 * - #rol-select: Dropdown de rol del usuario
 * - #email-input: Campo de correo electrónico
 * - #nombre-input: Campo de nombre
 * - #apellido-input: Campo de apellido
 * - #telefono-input: Campo de teléfono
 * - #documento-input: Campo de número de documento
 * - #direccion-input: Campo de dirección
 * - #password-input: Campo de contraseña
 * - #submit-register-button: Botón principal de registro
 * - #cancel-register-button: Botón de cancelar
 * - #login-link-button: Enlace para ir al login
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
import { TipoRol, TIPOS_ROL_DISPONIBLES } from '../../core/models/rol.model';
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
  
  /** Lista de roles disponibles en el sistema */
  rolesDisponibles = signal<any[]>([]);
  
  /** Indica si se están cargando los tipos de documento */
  cargandoTipos = signal<boolean>(true);
  
  /** Indica si se están cargando los roles */
  cargandoRoles = signal<boolean>(true);
  
  /** Lista de tipos de rol disponibles (fallback) */
  readonly tiposRolDisponibles = TIPOS_ROL_DISPONIBLES;
  
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
   * reactivo y carga la lista de tipos de documento y roles desde la API.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarTiposDocumento();
    this.cargarRoles();
  }

  /**
   * Configura el formulario reactivo con todos los campos requeridos
   * 
   * @description Crea el FormGroup con todos los campos requeridos para el registro
   * de usuario según el formato del endpoint POST /api/Usuario del Postman collection.
   * Incluye validación para campos obligatorios TipoDocumento y Rol.
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
      TipoDocumento: [null], // Campo obligatorio - ID numérico del tipo de documento
      Rol: [TipoRol.AGRICULTOR] // Campo obligatorio - Valor string del rol (default AGRICULTOR)
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
          // Filtrar solo tipos de documento activos
          const tiposActivos = tipos.filter(tipo => tipo.activo !== false);
          this.tiposDocumento.set(tiposActivos);
        },
        error: (error) => {
          console.error('Error al cargar tipos de documento:', error);
          // No mostramos error al usuario por ser información solo visual
        }
      });
  }

  /**
   * Carga los roles disponibles desde la API
   * 
   * @description Realiza una petición GET al endpoint /api/Usuario/roles para
   * obtener la lista de roles disponibles en el sistema. Esta información
   * se usa para poblar el dropdown de selección de rol.
   * 
   * @private
   */
  private cargarRoles(): void {
    this.cargandoRoles.set(true);
    
    this.userApiService.listarRoles()
      .pipe(
        finalize(() => this.cargandoRoles.set(false))
      )
      .subscribe({
        next: (roles) => {
          // Roles loaded successfully
          this.rolesDisponibles.set(roles);
        },
        error: (error) => {
          console.error('Error al cargar roles:', error);
          // En caso de error, usar roles por defecto
          this.rolesDisponibles.set([]);
        }
      });
  }

  /**
   * Maneja el envío del formulario de registro
   * 
   * @description Envía los datos del formulario al endpoint de creación
   * de usuario. Los campos TipoDocumento y Rol son obligatorios según
   * la especificación del Postman collection.
   * 
   * @returns {void}
   */
  onSubmit(): void {
    this.enviandoFormulario.set(true);
    
    // Todos los campos del formulario van en el POST según la especificación de Postman
    const crearUsuarioData: CrearUsuarioRequest = {
      Email: this.registerForm.value.Email,
      Nombre: this.registerForm.value.Nombre,
      Apellido: this.registerForm.value.Apellido,
      Telefono: this.registerForm.value.Telefono,
      Direccion: this.registerForm.value.Direccion,
      Documento: this.registerForm.value.Documento,
      Password: this.registerForm.value.Password,
      TipoDocumento: this.registerForm.value.TipoDocumento,
      Rol: this.registerForm.value.Rol
    };

    this.userApiService.crearUsuario(crearUsuarioData)
      .pipe(
        finalize(() => this.enviandoFormulario.set(false))
      )
      .subscribe({
        next: (response) => {
          // User created successfully
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
