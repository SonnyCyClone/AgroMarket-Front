/**
 * Mapper seguro para productos de AgroMarket
 * 
 * @description Funciones utilitarias para mapear respuestas del API a modelos seguros,
 * garantizando que no hay valores null/undefined que rompan la UI.
 * Todos los campos string tendrán valores por defecto y tipos seguros.
 * 
 * @author AgroMarket Team
 * @since 2.0.0
 */

import { Product, ProductDetailed, LegacyProduct } from '../models/product.model';

/**
 * Mapea respuesta del API a modelo Product seguro
 * 
 * @description Convierte la respuesta cruda del API a un objeto Product
 * con todos los campos garantizados como no-null. Aplica valores por
 * defecto seguros para evitar errores de null reference.
 * 
 * @param dto - Objeto crudo del API (puede tener campos null/undefined)
 * @returns Product con campos seguros y valores por defecto
 */
export function mapToProduct(dto: any): Product {
  return {
    id: Number(dto?.id ?? 0),
    variedad: String(dto?.variedad ?? '').trim() || 'Producto sin nombre',
    descripcion: String(dto?.descripcion ?? '').trim(),
    precio: Number(dto?.precio ?? 0),
    cantidadDisponible: Number(dto?.cantidadDisponible ?? 0),
    unidadesId: Number(dto?.unidadesId ?? 3), // Default a 'unidades'
    idTipoProducto: Number(dto?.idTipoProducto ?? 1),
    imagenUrl: dto?.imagenUrl ? String(dto.imagenUrl).trim() : null,
    activo: Boolean(dto?.activo ?? true),
    fechaCreacion: String(dto?.fechaCreacion ?? new Date().toISOString()),
    fechaActualizacion: String(dto?.fechaActualizacion ?? new Date().toISOString())
  };
}

/**
 * Mapea respuesta del API a modelo ProductDetailed seguro
 * 
 * @description Similar a mapToProduct pero incluye información
 * de relaciones (unidad, tipo, categoría) también mapeadas de forma segura.
 * 
 * @param dto - Objeto crudo del API con relaciones
 * @returns ProductDetailed con todos los campos seguros
 */
export function mapToProductDetailed(dto: any): ProductDetailed {
  const baseProduct = mapToProduct(dto);
  
  return {
    ...baseProduct,
    unidad: dto?.unidad ? {
      id: Number(dto.unidad.id ?? 0),
      sigla: String(dto.unidad.sigla ?? '').trim() || 'UD',
      descripcion: String(dto.unidad.descripcion ?? '').trim() || 'Unidades',
      activo: Boolean(dto.unidad.activo ?? true)
    } : undefined,
    tipoProducto: dto?.tipoProducto ? {
      id: Number(dto.tipoProducto.id ?? 0),
      sigla: String(dto.tipoProducto.sigla ?? '').trim() || 'GEN',
      descripcion: String(dto.tipoProducto.descripcion ?? '').trim() || 'General',
      activo: Boolean(dto.tipoProducto.activo ?? true)
    } : undefined,
    categoria: dto?.categoria ? {
      id: Number(dto.categoria.id ?? 0),
      sigla: String(dto.categoria.sigla ?? '').trim() || 'GEN',
      descripcion: String(dto.categoria.descripcion ?? '').trim() || 'General',
      activo: Boolean(dto.categoria.activo ?? true)
    } : undefined
  };
}

/**
 * Mapea producto legacy a formato seguro
 * 
 * @description Convierte productos del formato legacy a un formato
 * seguro sin valores null que puedan romper la UI.
 * 
 * @param dto - Producto en formato legacy
 * @returns LegacyProduct con campos seguros
 */
export function mapToLegacyProduct(dto: any): LegacyProduct {
  return {
    id: String(dto?.id ?? '0').trim(),
    name: String(dto?.name ?? '').trim() || 'Producto sin nombre',
    category: String(dto?.category ?? '').trim() || 'General',
    brand: String(dto?.brand ?? '').trim() || 'Sin marca',
    price: Number(dto?.price ?? 0),
    discountPercent: dto?.discountPercent ? Number(dto.discountPercent) : undefined,
    imageUrl: String(dto?.imageUrl ?? '').trim() || '',
    description: String(dto?.description ?? '').trim(),
    createdAt: String(dto?.createdAt ?? new Date().toISOString())
  };
}

/**
 * Valida si un string está vacío o es solo espacios
 * 
 * @description Utilitario para verificar si un string tiene contenido real
 * después de trim. Útil para validaciones en mappers.
 * 
 * @param value - String a validar
 * @returns true si está vacío o solo tiene espacios
 */
export function isEmptyString(value: string | null | undefined): boolean {
  return !value || String(value).trim().length === 0;
}

/**
 * Obtiene un string seguro con fallback
 * 
 * @description Convierte cualquier valor a string seguro,
 * aplicando trim y fallback si está vacío.
 * 
 * @param value - Valor a convertir
 * @param fallback - Valor por defecto si está vacío
 * @returns String seguro no-null
 */
export function getSafeString(value: any, fallback: string = ''): string {
  const str = String(value ?? '').trim();
  return str.length > 0 ? str : fallback;
}

/**
 * Trunca un string de forma segura
 * 
 * @description Corta un string a la longitud especificada,
 * manejando valores null/undefined de forma segura.
 * 
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @param ellipsis - Sufijo para indicar truncado
 * @returns String truncado de forma segura
 */
export function truncateText(text: string | null | undefined, maxLength: number = 120, ellipsis: string = '...'): string {
  const safeText = getSafeString(text);
  if (safeText.length <= maxLength) {
    return safeText;
  }
  return safeText.slice(0, maxLength) + ellipsis;
}