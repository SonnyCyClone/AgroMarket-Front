/**
 * Componente de carga de imágenes con drag & drop para AgroMarket
 * 
 * @description Componente reutilizable que proporciona una interfaz moderna
 * para cargar imágenes con soporte para drag & drop, validaciones automáticas,
 * preview de imagen y gestión de archivos mejorada.
 * 
 * Características:
 * - Drag & drop de archivos de imagen
 * - Click para seleccionar archivo (fallback)
 * - Validación automática de tipo, tamaño y dimensiones
 * - Preview de imagen con opción de remover
 * - Indicadores de carga y estado
 * - Diseño responsivo y accesible
 * - Integración con Angular Reactive Forms
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Component, Input, Output, EventEmitter, forwardRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Evento emitido cuando el estado de carga cambia
 */
export interface ImageUploadLoadingEvent {
  isLoading: boolean;
  progress?: number;
}

/**
 * Evento emitido cuando ocurre un error
 */
export interface ImageUploadErrorEvent {
  error: string;
  code: 'FILE_TYPE' | 'FILE_SIZE' | 'DIMENSIONS' | 'READ_ERROR' | 'GENERAL';
}

/**
 * Configuración del componente de carga de imágenes
 */
export interface ImageUploadConfig {
  maxFileSize?: number; // En bytes, default: 5MB
  minWidth?: number; // Píxeles, default: 100
  minHeight?: number; // Píxeles, default: 100
  acceptedTypes?: string[]; // Tipos MIME aceptados
  showPreview?: boolean; // Mostrar preview, default: true
  dragDropEnabled?: boolean; // Habilitar drag & drop, default: true
  placeholder?: string; // Texto del placeholder
}

/**
 * Componente de carga de imágenes con drag & drop
 * 
 * @description Implementa ControlValueAccessor para integración con formularios reactivos.
 * Proporciona una interfaz moderna y accesible para cargar imágenes.
 */
@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ]
})
export class ImageUploadComponent implements ControlValueAccessor {
  /** Configuración del componente */
  @Input() config: ImageUploadConfig = {};
  
  /** ID único para el input de archivo */
  @Input() inputId = 'image-upload-' + Math.random().toString(36).substr(2, 9);
  
  /** Si el componente está deshabilitado */
  @Input() disabled = false;
  
  /** Eventos del componente */
  @Output() loadingChange = new EventEmitter<ImageUploadLoadingEvent>();
  @Output() errorOccurred = new EventEmitter<ImageUploadErrorEvent>();
  @Output() fileSelected = new EventEmitter<File | null>();
  
  /** Referencia al input de archivo */
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  
  /** Estados del componente */
  isLoading = false;
  isDragOver = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  
  /** Configuración por defecto */
  private defaultConfig: Required<ImageUploadConfig> = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    minWidth: 100,
    minHeight: 100,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    showPreview: true,
    dragDropEnabled: true,
    placeholder: 'Arrastra una imagen aquí o haz clic para seleccionar'
  };
  
  /** Funciones de ControlValueAccessor */
  private onChange = (file: File | null) => {};
  private onTouched = () => {};

  /**
   * Obtiene la configuración efectiva combinando defaults con input
   */
  get effectiveConfig(): Required<ImageUploadConfig> {
    return { ...this.defaultConfig, ...this.config };
  }

  /**
   * Maneja el evento de drag over
   * 
   * @param {DragEvent} event - Evento de drag
   */
  onDragOver(event: DragEvent): void {
    if (!this.effectiveConfig.dragDropEnabled || this.disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  /**
   * Maneja el evento de drag leave
   * 
   * @param {DragEvent} event - Evento de drag
   */
  onDragLeave(event: DragEvent): void {
    if (!this.effectiveConfig.dragDropEnabled || this.disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  /**
   * Maneja el evento de drop
   * 
   * @param {DragEvent} event - Evento de drop
   */
  onDrop(event: DragEvent): void {
    if (!this.effectiveConfig.dragDropEnabled || this.disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  /**
   * Maneja la selección de archivo mediante click
   * 
   * @param {Event} event - Evento del input file
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      this.processFile(file);
    } else {
      this.clearFile();
    }
  }

  /**
   * Abre el selector de archivos
   */
  openFileSelector(): void {
    if (this.disabled) return;
    this.fileInput.nativeElement.click();
  }

  /**
   * Procesa un archivo seleccionado
   * 
   * @param {File} file - Archivo a procesar
   * @private
   */
  private processFile(file: File): void {
    this.onTouched();
    this.setLoading(true);
    
    // Validar tipo de archivo
    if (!this.effectiveConfig.acceptedTypes.includes(file.type.toLowerCase())) {
      this.emitError(`Tipo de archivo no válido. Use: ${this.effectiveConfig.acceptedTypes.join(', ')}`, 'FILE_TYPE');
      this.setLoading(false);
      return;
    }
    
    // Validar tamaño
    if (file.size > this.effectiveConfig.maxFileSize) {
      this.emitError(`El archivo es muy grande (${this.formatFileSize(file.size)}). Máximo: ${this.formatFileSize(this.effectiveConfig.maxFileSize)}`, 'FILE_SIZE');
      this.setLoading(false);
      return;
    }
    
    // Validar dimensiones
    this.validateImageDimensions(file)
      .then(isValid => {
        if (!isValid) {
          this.emitError(`La imagen debe tener dimensiones mínimas de ${this.effectiveConfig.minWidth}x${this.effectiveConfig.minHeight} píxeles`, 'DIMENSIONS');
          this.setLoading(false);
          return;
        }
        
        // Si todo está bien, procesar la imagen
        this.setFile(file);
      })
      .catch(() => {
        // Si falla la validación de dimensiones, continuar
        this.setFile(file);
      });
  }

  /**
   * Establece el archivo seleccionado y genera preview
   * 
   * @param {File} file - Archivo a establecer
   * @private
   */
  private setFile(file: File): void {
    this.selectedFile = file;
    
    if (this.effectiveConfig.showPreview) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
        this.setLoading(false);
        this.notifyChange();
      };
      
      reader.onerror = () => {
        this.emitError('Error al leer el archivo de imagen', 'READ_ERROR');
        this.setLoading(false);
      };
      
      reader.readAsDataURL(file);
    } else {
      this.setLoading(false);
      this.notifyChange();
    }
  }

  /**
   * Limpia el archivo seleccionado
   */
  clearFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    
    // Limpiar el input de archivo
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    
    this.notifyChange();
  }

  /**
   * Valida las dimensiones de una imagen
   * 
   * @param {File} file - Archivo de imagen
   * @returns {Promise<boolean>} Promise que resuelve true si las dimensiones son válidas
   * @private
   */
  private validateImageDimensions(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        const isValid = img.width >= this.effectiveConfig.minWidth && 
                       img.height >= this.effectiveConfig.minHeight;
        resolve(isValid);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };
      
      img.src = url;
    });
  }

  /**
   * Establece el estado de carga
   * 
   * @param {boolean} loading - Estado de carga
   * @param {number} progress - Progreso opcional
   * @private
   */
  private setLoading(loading: boolean, progress?: number): void {
    this.isLoading = loading;
    this.loadingChange.emit({ isLoading: loading, progress });
  }

  /**
   * Emite un evento de error
   * 
   * @param {string} error - Mensaje de error
   * @param {string} code - Código de error
   * @private
   */
  private emitError(error: string, code: ImageUploadErrorEvent['code']): void {
    this.errorOccurred.emit({ error, code });
  }

  /**
   * Notifica cambio de archivo
   * 
   * @private
   */
  private notifyChange(): void {
    this.onChange(this.selectedFile);
    this.fileSelected.emit(this.selectedFile);
  }

  /**
   * Formatea el tamaño de archivo en formato legible
   * 
   * @param {number} bytes - Tamaño en bytes
   * @returns {string} Tamaño formateado
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Obtiene los tipos de archivo formateados para mostrar
   * 
   * @returns {string} Tipos de archivo separados por comas
   */
  getFormattedFileTypes(): string {
    return this.effectiveConfig.acceptedTypes
      .map(type => type.split('/')[1].toUpperCase())
      .join(', ');
  }

  // Implementación de ControlValueAccessor
  
  /**
   * Establece el valor del control
   * 
   * @param {File | null} value - Archivo a establecer
   */
  writeValue(value: File | null): void {
    if (value !== this.selectedFile) {
      if (value) {
        this.setFile(value);
      } else {
        this.clearFile();
      }
    }
  }

  /**
   * Registra función de cambio
   * 
   * @param {function} fn - Función de cambio
   */
  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Registra función de touched
   * 
   * @param {function} fn - Función de touched
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Establece el estado deshabilitado
   * 
   * @param {boolean} isDisabled - Si está deshabilitado
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
