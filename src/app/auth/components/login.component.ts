import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
})
export class LoginComponent {
  user = { username: '', password: '' }; // Objeto para almacenar las credenciales
  errorMessage = ''; // Mensaje de error
  isLoading = false; // Estado de carga

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    // Verifica si el formulario es válido
    if (form.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    // Activa el estado de carga
    this.isLoading = true;
    this.errorMessage = '';

    // Realiza el login
    this.authService.login(this.user).subscribe({
      next: (res) => {
        const token = res?.token;
        if (token) {
          // Guarda el token en el localStorage
          this.authService.saveAuthData(token);
          // Limpia el formulario
          form.resetForm();
          // Redirige al usuario a la página de inicio
          this.router.navigate(['/home']);
        } else {
          // Muestra un mensaje de error si no hay token en la respuesta
          this.errorMessage = 'Error en la respuesta del servidor.';
        }
      },
      error: () => {
        // Muestra un mensaje de error si el login falla
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        this.isLoading = false;
      },
      complete: () => {
        // Desactiva el estado de carga
        this.isLoading = false;
      },
    });
  }
}