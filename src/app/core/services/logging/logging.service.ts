/**
 * Servicio de logging centralizado para AgroMarket
 * 
 * @description Servicio que proporciona logging controlado con niveles y feature flags.
 * Permite activar/desactivar logs de debug en desarrollo y mantener solo logs
 * esenciales en producción.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

/**
 * Servicio centralizado de logging
 * 
 * @description Maneja todos los logs de la aplicación con niveles configurables.
 * En desarrollo permite debug opcional, en producción solo warn/error.
 */
@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private readonly logLevel: LogLevel;
  private readonly enableDebugLogs: boolean;

  constructor() {
    // Configurar nivel de log según entorno
    this.logLevel = environment.production ? LogLevel.WARN : LogLevel.DEBUG;
    this.enableDebugLogs = !environment.production && (environment as any).enableDebugLogs !== false;
  }

  /**
   * Log de debug - solo en desarrollo con flag activado
   */
  debug(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG) && this.enableDebugLogs) {
      const prefix = this.getPrefix('DEBUG', context);
      if (data !== undefined) {
        console.log(`${prefix} ${message}`, data);
      } else {
        console.log(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Log informativo - desarrollo y producción controlada
   */
  info(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const prefix = this.getPrefix('INFO', context);
      if (data !== undefined) {
        console.info(`${prefix} ${message}`, data);
      } else {
        console.info(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Log de advertencia - siempre activo
   */
  warn(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const prefix = this.getPrefix('WARN', context);
      if (data !== undefined) {
        console.warn(`${prefix} ${message}`, data);
      } else {
        console.warn(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Log de error - siempre activo
   */
  error(message: string, context?: string, error?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const prefix = this.getPrefix('ERROR', context);
      if (error !== undefined) {
        console.error(`${prefix} ${message}`, error);
      } else {
        console.error(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Log específico para debugging de Home - temporal
   */
  debugHome(message: string, data?: any): void {
    if (this.enableDebugLogs) {
      const prefix = '🏠 [HOME-DEBUG]';
      if (data !== undefined) {
        console.log(`${prefix} ${message}`, data);
      } else {
        console.log(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Log específico para debugging de API - temporal
   */
  debugAPI(message: string, data?: any): void {
    if (this.enableDebugLogs) {
      const prefix = '🌐 [API-DEBUG]';
      if (data !== undefined) {
        console.log(`${prefix} ${message}`, data);
      } else {
        console.log(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Verifica si debe loggear según el nivel
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  /**
   * Genera prefijo para logs con timestamp y contexto
   */
  private getPrefix(level: string, context?: string): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const contextStr = context ? `[${context}]` : '';
    return `[${timestamp}] [${level}]${contextStr}`;
  }
}