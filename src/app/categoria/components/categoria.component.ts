import { Component, EventEmitter, Output, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Categoria } from '../../interfaces/interfaces';
import { CategoriaService } from '../categoria.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-categoria',
  standalone: false,
  templateUrl: './categoria.component.html',
  styles: ``,
  providers: [ConfirmationService, MessageService],
})
export class CategoriaComponent {
  @Output() onDebounce: EventEmitter<string> = new EventEmitter(); // Emite el término de búsqueda con debounce

  categorias: Categoria[] = [];
  hayError: boolean = false;
  termino: string = '';
  errorAgregarCategoria: string | null = '';
  errorBuscar: string | null = null;
  nuevaCategoria: Categoria = { id: 0, nombre: '' };
  mostrarFormularioEditar: boolean = false;
  mostrarFormularioAgregar: boolean = false;
  categoriaSeleccionada: Categoria = { id: 0, nombre: '' }

  private debouncer: Subject<string> = new Subject<string>(); // Subject para manejar el debounce
  private destroy$: Subject<void> = new Subject<void>(); // Subject para manejar la destrucción del componente

  constructor(private categoriaService: CategoriaService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.listar(); // Llama al método listar al inicializar el componente

    // Configura el debounce
    this.debouncer
      .pipe(
        debounceTime(300), // Espera 300ms después de la última tecla presionada
        takeUntil(this.destroy$) // Cancela la suscripción cuando el componente se destruye
      )
      .subscribe((valor) => {
        this.onDebounce.emit(valor); // Emite el término de búsqueda
        this.resultados(valor); // Llama a la función de resultados
      });
  }

  ngOnDestroy(): void {
    // Limpia las suscripciones cuando el componente se destruye
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para obtener todos los categorias
  listar() {
    this.categoriaService.getCategorias().subscribe(
      (categorias) => {
        this.categorias = categorias;
        this.hayError = false;
      },
      (err) => {
        this.categorias = [];
        this.hayError = true;
      }
    );
  }

  // Método para buscar usuarios por término
  buscar() {
    this.categoriaService.buscarCategoria(this.termino).subscribe(
      (categorias) => {
        this.categorias = categorias;
      },
      (error) => {
        this.categorias = [];
        this.errorBuscar = (error.error.message as string) || 'Error al agregar usuario';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorBuscar,
        });
      }
    );
  }

  // Método que se ejecuta cada vez que se presiona una tecla
  teclaPresionada() {
    this.debouncer.next(this.termino); // Emite el término de búsqueda al Subject
  }

  // Método para agregar un nuevo usuario
  agregarCategoria() {
    // Reinicia el mensaje de error
    this.errorAgregarCategoria = null;

    // Validación de campos obligatorios
    if (!this.nuevaCategoria.nombre) {
      this.errorAgregarCategoria = 'Todos los campos son obligatorios.';
      return;
    }

    // Llama al servicio para agregar el usuario
    this.categoriaService.agregarCategoria(this.nuevaCategoria).subscribe(
      (categoria) => {
        this.categorias.push(categoria); // Agrega el nuevo usuario a la lista
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoria agregada correctamente',
        });
        this.cerrarModal('addCategoryModal');
      },
      (error) => {
        this.errorAgregarCategoria = (error.error.message as string) || 'Error al agregar categoria';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorAgregarCategoria,
        });
      }
    );
  }



  // Método para manejar las resultados
  resultados(termino: string) {
    this.hayError = false; // Reinicia el estado de error

    // Aquí puedes hacer una solicitud HTTP para obtener resultados
    this.categoriaService.buscarCategoria(termino).subscribe(
      (categorias) => {
        this.categorias = categorias; // Asigna los usuarios encontrados
      },
      (err) => {
        this.categorias = []; // Limpia la lista de usuarios en caso de error
      }
    );
  }

  SeleccionarCategoria(categoria: any) {
    this.categoriaSeleccionada = { ...categoria }; // Crea una copia para evitar la mutación directa
  }

  abrirModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  cerrarModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  }
  // Envía los cambios al servidor
  editarCategoria(categoria: Categoria): void {
    this.errorAgregarCategoria = null;

    // Validación de campos obligatorios
    if (!this.categoriaSeleccionada.nombre) {
      this.errorAgregarCategoria = 'Todos los campos son obligatorios.';
      return;
    }

    this.categoriaService.editarCategoria(categoria.id, this.categoriaSeleccionada).subscribe(
      () => {
        // Actualiza la categoría en la lista
        const index = this.categorias.findIndex((c) => c.id === categoria.id);
        if (index !== -1) {
          this.categorias[index].nombre = this.nuevaCategoria.nombre;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoria actualizada correctamente',
        });
        this.listar();
        this.cerrarModal('editCategoryModal');
      },
      (err) => {
        console.error('Error al actualizar', err);
      }
    );

  }

}
