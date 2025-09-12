/**
 * Guard de autenticación para rol AGRICULTOR en AgroMarket
 * 
 * @description Guard que verifica si el usuario actual tiene rol de AGRICULTOR
 * y está autenticado. Se utiliza para proteger rutas que requieren permisos
 * de agricultor como crear/editar productos.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

/**
 * Guard funcional para verificar rol de AGRICULTOR
 * 
 * @description Verifica que el usuario esté autenticado Y tenga rol de AGRICULTOR.
 * Si no cumple alguna condición, redirige según el caso:
 * - No autenticado: redirige a /login
 * - Autenticado pero sin rol AGRICULTOR: redirige a / (home) con mensaje
 * 
 * @param {ActivatedRouteSnapshot} route - Información de la ruta activada
 * @param {RouterStateSnapshot} state - Estado del router
 * @returns {boolean} True si el usuario puede acceder, false en caso contrario
 * 
 * @example
 * ```typescript
 * // En app.routes.ts
 * {
 *   path: 'products/new',
 *   loadComponent: () => import('./features/register-product/register-product.page'),
 *   canActivate: [agricultorGuard]
 * }
 * ```
 */
export const agricultorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está autenticado
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar si tiene rol de AGRICULTOR
  if (!authService.isAgricultor()) {
    // Usuario autenticado pero sin permisos suficientes
    router.navigate(['/'], { 
      queryParams: { 
        message: 'No tienes permisos para acceder a esta sección. Solo usuarios con rol AGRICULTOR pueden gestionar productos.' 
      } 
    });
    return false;
  }

  // Usuario autenticado y con rol correcto
  return true;
};
