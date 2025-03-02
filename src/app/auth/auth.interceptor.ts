import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const clonedRequest = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next.handle(clonedRequest).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            // Manejar errores de autorización (401)
            this.authService.logout();
            this.router.navigate(['/login']);
            return throwError(error); // Re-lanzar el error
          }
          return throwError(error); // Re-lanzar otros errores
        })
      );
    }

    return next.handle(req); // Si no hay token, simplemente pasa la solicitud
  }
}