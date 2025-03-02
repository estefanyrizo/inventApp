import { Component, EventEmitter, Output, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { User } from '../../interfaces/interfaces';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FlowbiteService } from '../../flowbite.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgForm } from '@angular/forms'; // Importa NgForm

@Component({
  standalone: false,
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  providers: [ConfirmationService, MessageService],
})
export class UsuarioComponent implements OnInit, OnDestroy {

  @Output() onDebounce: EventEmitter<string> = new EventEmitter();

  roles = [
    { name: 'Administrador', value: 'admin' },
    { name: 'User', value: 'user' }
  ];
  botonDisponible: boolean = false;
  usuarios: User[] = [];
  termino: string = '';
  hayError: boolean = false;
  nuevoUsuario: User = { id: 0, username: '', password: '', role: 'user' };
  errorAgregarUsuario: string | null = null;
  @ViewChild('editUserModal') editUserModal: ElementRef | undefined;
  @ViewChild('usuarioForm') usuarioForm: NgForm | undefined;

  private debouncer: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private usuarioService: UsuarioService, private flowbiteService: FlowbiteService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
      console.log('Flowbite loaded', flowbite);
    });
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
      () => {
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
      () => {
        this.usuarios = [];
      }
    );
  }

  agregarUsuario() {
    this.usuarioService.agregarUsuario(this.nuevoUsuario).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario agregado correctamente',
        });
        this.listar();
        this.nuevoUsuario = { id: 0, username: '', password: '', role: '' };
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
    const nuevoRol = usuario.role === 'admin' ? 'user' : 'admin';
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

  teclaPresionada() {
    this.debouncer.next(this.termino);
  }

  sugerencias(termino: string) {
    this.hayError = false;

    this.usuarioService.buscarUsuario(termino).subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
      },
      () => {
        this.usuarios = [];
      }
    );
  }
}