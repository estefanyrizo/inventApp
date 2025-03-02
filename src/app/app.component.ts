import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service'; // Importa el servicio de autenticación
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  title = 'Mi Aplicación';

  constructor(public authService: AuthService, private router: Router) {}

  // Método para cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
  }
}