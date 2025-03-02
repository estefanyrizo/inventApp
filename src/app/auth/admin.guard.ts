import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { take, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAdmin().pipe(
      take(1),
      switchMap((isAdmin) => {
        if (isAdmin) {
          return of(true);
        } else {
          this.router.navigate(['/home']); // Redirige a /home si no es admin
          return of(false);
        }
      }),
      catchError(() => {
        this.router.navigate(['/home']); // Redirige a /home si hay un error
        return of(false);
      })
    );
  }
}