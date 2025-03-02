import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Servicios
import { AuthService } from './auth.service';

// Interceptores
import { AuthInterceptor } from './auth.interceptor';

// Guards
import { AuthGuard } from './auth.guard';

// Componentes
import { LoginComponent } from './components/login.component';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    LoginComponent,
  ],
  providers: [
    AuthService,
    AuthGuard,
  ]
})
export class AuthModule { }