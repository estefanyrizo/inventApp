import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { User } from '../../interfaces/interfaces';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
})
export class UsuarioComponent implements OnInit, OnDestroy {
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();

  usuarios: User[] = [];
  termino: string = '';
  hayError: boolean = false;
  mostrarFormulario: boolean = false;
  nuevoUsuario: User = { id: 0, username: '', password: '', role: 'user' };
  errorAgregarUsuario: string | null = null;

  private debouncer: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.listar();

    this.debouncer
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe((valor) => {
        this.onDebounce.emit(valor);
        this.sugerencias(valor);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  listar() {
    this.usuarioService.getUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
        this.hayError = false;
      },
      (err) => {
        this.usuarios = [];
        this.hayError = true;
      }
    );
  }

  buscar() {
    this.usuarioService.buscarUsuario(this.termino).subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
        this.hayError = false;
      },
      (err) => {
        this.usuarios = [];
        this.hayError = true;
      }
    );
  }

  agregarUsuario() {
    this.errorAgregarUsuario = null;

    if (!this.nuevoUsuario.username || !this.nuevoUsuario.password || !this.nuevoUsuario.role) {
      this.errorAgregarUsuario = 'Todos los campos son obligatorios.';
      return;
    }

    this.usuarioService.agregarUsuario(this.nuevoUsuario).subscribe(
      (usuario) => {
        this.usuarios.push(usuario);
        this.mostrarFormulario = false;
        this.nuevoUsuario = {id: 0, username: '', password: '', role: 'user' };
      },
      (err) => {
        if (err.status === 400 && err.error.message === 'El nombre de usuario ya está en uso') {
          this.errorAgregarUsuario = 'El nombre de usuario ya está en uso.';
        } else {
          this.errorAgregarUsuario = 'Error al agregar el usuario. Inténtalo de nuevo.';
        }
        console.error('Error al agregar el usuario:', err);
      }
    );
  }

  cambiarRol(usuario: User) {
    const nuevoRol = usuario.role === 'admin' ? 'user' : 'admin';
    this.usuarioService.cambiarRolUsuario(usuario.id, nuevoRol).subscribe(
      (usuarioActualizado) => {
        const index = this.usuarios.findIndex((u) => u.id === usuario.id);
        if (index !== -1) {
          this.usuarios[index].role = nuevoRol;
        }
      },
      (err) => {
        console.error('Error al cambiar el rol:', err);
      }
    );
  }

  teclaPresionada() {
    this.debouncer.next(this.termino);
  }

  sugerencias(termino: string) {
    this.hayError = false;

    this.usuarioService.buscarUsuario(termino).subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
      },
      (err) => {
        this.usuarios = [];
      }
    );
  }
}
