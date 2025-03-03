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
  user = { username: '', password: '' };
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.logout();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.user).subscribe({
      next: (res) => {
        const token = res?.token;

        if (token) {
          // Llama a isActive para verificar si el usuario está activo
          this.authService.isActive().subscribe({
            next: (isActive) => {
              if (!isActive) {
                this.errorMessage = 'Tu cuenta está inactiva. Contacta al administrador.';
                this.isLoading = false;
                return;
              }

              // Si está activo, guarda el token y navega
              this.authService.saveAuthData(token);
              form.resetForm();
              this.router.navigate(['']);
            },
            error: () => {
              this.errorMessage = 'Error al verificar el estado de la cuenta.';
              this.isLoading = false;
            }
          });
        } else {
          this.errorMessage = 'Error en la respuesta del servidor.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al iniciar sesión.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }


}