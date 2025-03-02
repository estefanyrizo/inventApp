import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]> {
    const url = `${this.apiUrl}/categorias`;
    return this.http.get<Categoria[]>(url);
  }

  buscarCategoria(termino: string): Observable<Categoria[]> {
    const url = `${this.apiUrl}/categorias?nombre=${termino}`;
    return this.http.get<Categoria[]>(url);
  }

  agregarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/categorias`, categoria);
  }
  editarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.apiUrl}/categorias/${id}`, categoria);
  }
}
