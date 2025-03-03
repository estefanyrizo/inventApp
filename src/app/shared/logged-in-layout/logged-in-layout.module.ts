import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedInLayoutComponent } from './components/logged-in-layout.component';
import { AuthService } from '../../auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { AuthModule } from '../../auth/auth.module';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  declarations: [
    LoggedInLayoutComponent,
  ],
  imports: [
    CommonModule,
    AuthModule,
    ToastModule,
    AppRoutingModule,
  ],
  providers: [AuthService,  ToastModule,]
})
export class LoggedInLayoutModule { }
