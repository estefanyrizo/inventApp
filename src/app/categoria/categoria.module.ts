import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from './categoria.service';
import { CategoriaComponent } from './components/categoria.component';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    CategoriaComponent,
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
  providers: [CategoriaService, MessageService],
})
export class CategoriaModule { }
