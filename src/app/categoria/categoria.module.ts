import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from './categoria.service';
import { CategoriaComponent } from './components/categoria.component';


@NgModule({
  declarations: [
    CategoriaComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CategoriaService],
})
export class CategoriaModule { }
