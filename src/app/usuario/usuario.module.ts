import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './components/usuario.component';
import {HttpClientModule } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsuarioComponent,
  ],
  imports: [
    CommonModule, 
    HttpClientModule,
    FormsModule
  ],
  providers: [UsuarioService],
})
export class UsuarioModule { }
