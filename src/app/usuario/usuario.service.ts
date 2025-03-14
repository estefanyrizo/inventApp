import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Si se probara la api localmente remplazar por: http://localhost:3000
  private readonly apiUrl = 'https://myjsonserver-production.up.railway.app';

  constructor(private http: HttpClient) { }

  getUsuarios (): Observable<User[]>{
    const url = `${this.apiUrl}/users`;
    return this.http.get<User[]>(url);
  }

  buscarUsuario(termino: string): Observable<User[]> {
    const url = `${this.apiUrl}/users?username=${termino}`;
    return this.http.get<User[]>(url);
  }

  agregarUsuario(usuario: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, usuario);
  }

  cambiarRolUsuario(id: number, nuevoRol: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, { role: nuevoRol });
  }
  cambiarEstadoUsuario(id: number, nuevoEstado: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, { estado: nuevoEstado });
  }
}
