import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa los componentes
import { LoginComponent } from './auth/components/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UsuarioComponent } from './usuario/components/usuario.component';
import { AdminGuard } from './auth/admin.guard';
import { CategoriaComponent } from './categoria/components/categoria.component';
import { ProductoComponent } from './producto/components/producto.component';
import { LoggedInLayoutComponent } from './shared/logged-in-layout/components/logged-in-layout.component';
import { AppLayout } from './layout/component/app.layout';


const routes: Routes = [
  { path: '', redirectTo: '/admin/productos', pathMatch: 'full' },
  // { path: '**', redirectTo: '/login', },
  {
    path: 'admin',
    component: AppLayout,
    children: [
      { path: 'usuarios', component: UsuarioComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'categorias', component: CategoriaComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'productos', component: ProductoComponent, canActivate: [AuthGuard] },
    ]
  },
  { path: 'login', component: LoginComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }