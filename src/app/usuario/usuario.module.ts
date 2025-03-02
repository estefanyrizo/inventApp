import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './components/usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown'; // Importa DropdownModule
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api'; // Import MessageService

@NgModule({
  declarations: [
    UsuarioComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MessageModule,
    InputTextModule,
    ConfirmDialogModule,
    ButtonModule,
    ToastModule,
    MessagesModule,
    DropdownModule,
    BrowserAnimationsModule,
    SelectButtonModule,
    DialogModule,
  ],
  providers: [UsuarioService, MessageService], // Added MessageService
})
export class UsuarioModule { }