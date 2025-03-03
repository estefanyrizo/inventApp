import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logged-in-layout',
  standalone: false,
  templateUrl: './logged-in-layout.component.html',
})
export class LoggedInLayoutComponent {
  
    constructor(public authService: AuthService, private router: Router) {}
  
    // Método para cerrar sesión
    logout() {
      this.authService.logout();
      this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
    }

}
