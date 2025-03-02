  import { Injectable } from '@angular/core';
  import { CanActivate, Router } from '@angular/router';
  import { AuthService } from './auth.service';
  import { Observable, of } from 'rxjs';
  import { map, take, catchError, switchMap } from 'rxjs/operators';

  @Injectable({
    providedIn: 'root',
  })
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> {
      return this.authService.isAuthenticated().pipe(
        take(1),
        switchMap((isAuthenticated) => {
          if (isAuthenticated) {
            return of(true);
          } else {
            this.router.navigate(['/login']);
            return of(false);
          }
        }),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }
  }