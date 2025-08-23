import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { Categoria } from '../../models/categoria.model';
import { TipoProducto } from '../../models/tipo-producto.model';
import { Unidad } from '../../models/unidad.model';
import { CreateProductRequest, CreateProductResponse } from '../../models/producto.create';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  constructor(private httpService: HttpService) {}

  listCategorias(): Observable<Categoria[]> {
    return this.httpService.get<Categoria[]>('/api/Categoria');
  }

  listUnidades(): Observable<Unidad[]> {
    return this.httpService.get<Unidad[]>('/api/Uniodades');
  }

  listTiposByCategoria(categoriaId: number): Observable<TipoProducto[]> {
    return this.httpService.get<TipoProducto[]>(`/api/TipoProducto/Categoria/${categoriaId}`);
  }

  createProduct(request: CreateProductRequest): Observable<CreateProductResponse> {
    const formData = new FormData();
    
    // Append all fields as strings to FormData
    formData.append('Variedad', request.Variedad);
    formData.append('Descripcion', request.Descripcion);
    formData.append('Precio', request.Precio.toString());
    formData.append('CantidadDisponible', request.CantidadDisponible.toString());
    formData.append('UnidadesId', request.UnidadesId.toString());
    formData.append('IdTipoProducto', request.IdTipoProducto.toString());
    formData.append('ImagenUrl', request.ImagenUrl);
    formData.append('Activo', request.Activo.toString());

    return this.httpService.postFormData<CreateProductResponse>('/api/Producto', formData);
  }
}
