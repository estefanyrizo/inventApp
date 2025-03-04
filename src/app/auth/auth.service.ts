import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, from, timer } from 'rxjs';
import { catchError, map, tap, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Si se probara la api localmente remplazar por: http://localhost:3000
  private readonly apiUrl = 'https://myjsonserver-production.up.railway.app';
  private readonly tokenKey = 'authToken';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuthState());
  private isAdminSubject = new BehaviorSubject<boolean>(this.checkInitialAdminState());
  isAdmin$ = this.isAdminSubject.asObservable().pipe(distinctUntilChanged());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable().pipe(distinctUntilChanged());
  private currentToken: string | null = this.getToken(); // Almacena el token actual

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.startLocalStorageMonitoring();
    }
  }

  private checkInitialAuthState(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !!this.getDecodedToken(); //verifica que el token sea valido
  }
  private checkInitialAdminState(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken || !decodedToken.role) {
      return false;
    }
    return decodedToken.role.toLowerCase() === 'admin';
  }

  login(user: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        this.saveAuthData(response.token);
        this.updateAuthState();
      })
    );
  }

  saveAuthData(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
    this.currentToken = token;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.currentToken = null;
    this.updateAuthState();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(this.tokenKey) : null;
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<{ message: string }>(`${this.apiUrl}/verifyToken`, {}, { headers }).pipe(
      tap(() => this.isAuthenticatedSubject.next(true)),
      map(() => true),
      catchError(() => {
        this.isAuthenticatedSubject.next(false);
        return of(false);
      })
    );
  }

  isActive(): Observable<boolean> {
    return of(this.getDecodedToken()?.estado ?? false);
  }


  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isAdmin(): Observable<boolean> {
    return of(this.getDecodedToken()?.role?.toLowerCase() === 'admin' || false);
  }

  private updateAuthState(): void {
    const decodedToken = this.getDecodedToken();
    const isAuthenticated = !!decodedToken;
    const isAdmin = decodedToken?.role?.toLowerCase() === 'admin';
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.isAdminSubject.next(isAdmin);
  }

  private startLocalStorageMonitoring(): void {
    timer(0, 1000)
      .pipe(
        map(() => this.getToken()),
        distinctUntilChanged()
      )
      .subscribe((newToken) => {
        if (newToken !== this.currentToken) {
          this.currentToken = newToken;
          this.updateAuthState();
          if (!newToken) {
            this.logout();
          } else {
            this.isAuthenticated().subscribe((isAuthenticated) => {
              if (!isAuthenticated) {
                this.logout();
              }
            });
          }
        }
      });
  }
}