import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000';
  private readonly tokenKey = 'authToken';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();
  private currentToken: string | null = null; // Almacena el token actual

  constructor(
    private http: HttpClient,
    private router: Router,

    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.currentToken = this.getToken(); // Inicializa el token actual
    if (isPlatformBrowser(this.platformId)) {
      this.startLocalStorageMonitoring();
    }
  }


  login(user: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        this.saveAuthData(response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  saveAuthData(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(this.tokenKey) || '' : '';
  }


  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<{ message: string }>(`${this.apiUrl}/verifyToken`, {}, { headers }).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(true);
      }),
      map(() => true),
      catchError(() => {
        this.isAuthenticatedSubject.next(false);
        return of(false);
      })
    );
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null; // Token no tiene el formato esperado.
      }
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getRole(): Observable<string> {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken || !decodedToken.role) {
      return of('');
    }
    return of(decodedToken.role);
  }

  isAdmin(): Observable<boolean> {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken || !decodedToken.role) {
      this.isAdminSubject.next(false);
      return of(false);
    }
    const isAdmin = decodedToken.role === 'admin';
    this.isAdminSubject.next(isAdmin);
    return of(isAdmin);
  }

  private startLocalStorageMonitoring(): void {
    setInterval(() => {
      const newToken = this.getToken();
      if (newToken !== this.currentToken) {
        this.currentToken = newToken;
        if (!newToken) {
          this.logout();
        } else {
          this.isAuthenticated().subscribe(
            (isAuthenticated) => {
              if (!isAuthenticated) {
                this.logout();
              }
            }
          );
        }
      }
    }, 1000); // Verifica cada segundo (ajusta según sea necesario)
  }
}