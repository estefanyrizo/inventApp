import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Asegúrate de importar tu AuthService

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAdmin().pipe(
      take(1), // Toma solo el primer valor emitido y completa la suscripción
      switchMap((isAdmin) => {
        if (isAdmin) {
          return of(true); // Permite la navegación si el usuario es admin
        } else {
          this.router.navigate(['']);
          return of(false); // Bloquea la navegación
        }
      }),
      catchError(() => {
        this.router.navigate(['']); 
        return of(false); // Bloquea la navegación en caso de error
      })
    );
  }
}