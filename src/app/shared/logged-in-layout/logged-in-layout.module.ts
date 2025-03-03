import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedInLayoutComponent } from './components/logged-in-layout.component';
import { AuthService } from '../../auth/auth.service';

@NgModule({
  declarations: [
    LoggedInLayoutComponent,
  ],
  imports: [
    CommonModule,
    AuthService,
  ]
})
export class LoggedInLayoutModule { }
