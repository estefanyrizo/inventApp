import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '././producto.service';
import { ProductoComponent } from './components/producto.component';
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
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [
    ProductoComponent,
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
    InputNumberModule
  ],
  providers: [ProductoService],
})
export class ProductoModule { }
