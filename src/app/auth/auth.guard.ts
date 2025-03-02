import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1), // Tomar solo el primer valor emitido
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true; // Permite el acceso si está autenticado
        } else {
          this.router.navigate(['/login']); // Redirige al login si no está autenticado
          return false;
        }
      })
    );
  }
}