import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Si se probara la api localmente remplazar por: http://localhost:3000
  private readonly apiUrl = 'https://myjsonserver-production.up.railway.app';

  constructor(private http: HttpClient) { }

  getproductos(): Observable<Producto[]> {
    const url = `${this.apiUrl}/productos`;
    return this.http.get<Producto[]>(url);
  }

  buscarProducto(termino: string): Observable<Producto[]> {
    const url = `${this.apiUrl}/productos?nombre=${termino}`;
    return this.http.get<Producto[]>(url);
  }

  agregarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}/productos`, producto);
  }
  editarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.patch<Producto>(`${this.apiUrl}/productos/${id}`, producto);
  }
}
