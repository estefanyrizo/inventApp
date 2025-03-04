// import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  user = { username: '', password: '' };
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

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
                this.errorMessage =
                  'Tu cuenta está inactiva. Contacta al administrador.';
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
            },
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

  @ViewChild('loginCard', { static: false }) loginCard!: ElementRef;
  @ViewChild('hoverOrb', { static: false }) hoverOrb!: ElementRef;

  onMouseMove(event: MouseEvent) {
    const card = this.loginCard.nativeElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0)`;

    if (this.hoverOrb) {
      const orb = this.hoverOrb.nativeElement;
      orb.style.top = `${y}px`;
      orb.style.left = `${x}px`;
    }
  }

  onMouseLeave() {
    const card = this.loginCard.nativeElement;
    card.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  }
}
