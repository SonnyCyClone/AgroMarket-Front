export interface CreateProductRequest {
  Variedad: string;
  Descripcion: string;
  Precio: number;
  CantidadDisponible: number;
  UnidadesId: number;
  IdTipoProducto: number;
  ImagenUrl: string;
  Activo: boolean;
}

export interface CreateProductResponse {
  id: number;
  variedad: string;
  descripcion: string;
  precio: number;
  cantidadDisponible: number;
  unidadesId: number;
  idTipoProducto: number;
  imagenUrl: string;
  activo: boolean;
  fechaCreacion: string;  // ISO
  creadoPor: string;
  fechaActualizacion?: string | null;
  modificadoPor?: string | null;
}
