import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  // Si se probara la api localmente remplazar por: http://localhost:3000
  private readonly apiUrl = 'http://dc0ws0ggw0sg8wscskcocg4s.137.184.75.110.sslip.io/';

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
