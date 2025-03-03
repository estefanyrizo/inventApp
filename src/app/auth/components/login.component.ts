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
          // Guarda el token en el localStorage
          this.authService.saveAuthData(token);
          // Limpia el formulario
          form.resetForm();
          this.router.navigate(['']);
        } else {
          this.errorMessage = 'Error en la respuesta del servidor.';
        }
      },
      error: () => {
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}