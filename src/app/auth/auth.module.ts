import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Servicios
import { AuthService } from './auth.service';

// Guards
import { AuthGuard } from './auth.guard';

// Componentes
import { LoginComponent } from './components/login.component';



import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { AdminGuard } from './admin.guard';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ButtonModule,
    InputTextModule, // Import InputTextModule
    CheckboxModule, // Import CheckboxModule
    RippleModule,
    MessageModule,

  ],
  exports: [
    LoginComponent,
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminGuard,
  ]
})
export class AuthModule { }