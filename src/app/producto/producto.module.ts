import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductoService } from './producto.service';
import { ProductoComponent } from './components/producto.component';


@NgModule({
  declarations: [
    ProductoComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
  ],
   providers: [ProductoService],
})
export class ProductoModule { }
