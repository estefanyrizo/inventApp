import { Component, EventEmitter, Output, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { User } from '../../interfaces/interfaces';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgForm } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  providers: [ConfirmationService, MessageService],
})
export class UsuarioComponent implements OnInit, OnDestroy {

  @Output() onDebounce: EventEmitter<string> = new EventEmitter();

  roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Editor', value: 'user' },
  ];
  botonDisponible: boolean = false;
  visible: boolean = false;
  usuarios: User[] = [];
  termino: string = '';
  hayError: boolean = false;
  nuevoUsuario: User = { id: 0, username: '', password: '', nombre: '', apellido: '', role: 'user', estado: true };
  errorAgregarUsuario: string | null = null;

  private debouncer: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private usuarioService: UsuarioService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.listar();

    this.debouncer
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe((valor) => {
        this.onDebounce.emit(valor);
        this.resultados(valor);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  getSeverity(estado: string) {
    switch (estado) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'danger';
      default:
        return 'info'; // O 'undefined' si prefieres manejar otros casos como no definidos
    }
  }

  listar() {
    this.usuarioService.getUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
        this.hayError = false;
      },
    );
  }


  buscar() {
    this.usuarioService.buscarUsuario(this.termino).subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
      },
    );
  }

  agregarUsuario() {
    this.visible = true;
    this.usuarioService.agregarUsuario(this.nuevoUsuario).subscribe(
      (usuario) => {
        this.usuarios.push(usuario);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario agregado correctamente',
        });
        this.visible = false;
      },
      (error) => {
        this.errorAgregarUsuario = (error.error.message as string) || 'Error al agregar usuario';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorAgregarUsuario,
        });
      }
    );
  }

  cambiarRol(usuario: User) {

    const nuevoRol = usuario.role;
    this.usuarioService.cambiarRolUsuario(usuario.id, nuevoRol).subscribe(
      () => {
        const index = this.usuarios.findIndex((u) => u.id === usuario.id);
        if (index !== -1) {
          this.usuarios[index].role = nuevoRol;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Rol actualizado correctamente',
        });
      },
      (err) => {
        console.error('Error al cambiar el rol:', err);
      }
    );
  }

  cambiarEstado(usuario: User) {
    const nuevoEstado = usuario.estado;
    this.usuarioService.cambiarEstadoUsuario(usuario.id, nuevoEstado).subscribe(
      () => {
        const index = this.usuarios.findIndex((u) => u.id === usuario.id);
        if (index !== -1) {
          this.usuarios[index].estado = nuevoEstado;
        }
        this.visible = false;
        this.nuevoUsuario = { id: 0, username: '', password: '', nombre: '', apellido: '', role: 'user', estado: true }; // Reinicia el formulario
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Estado actualizado correctamente',
        });
      },
      (err) => {
        console.error('Error al cambiar el estado:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cambiar el estado',
        });
      }
    );
  }

  // Cancela la edición y oculta el formulario
  cancelarAgregar(): void {
    this.visible = false;
    this.nuevoUsuario = { id: 0, username: '', password: '', nombre: '', apellido: '', role: 'user', estado: true }; // Reinicia el formulario
    this.errorAgregarUsuario = null; // Limpia el mensaje de error
  }

  teclaPresionada() {
    this.debouncer.next(this.termino);
  }

  resultados(termino: string) {
    this.hayError = false;

    this.usuarioService.buscarUsuario(termino).subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
      },
    );
  }
}