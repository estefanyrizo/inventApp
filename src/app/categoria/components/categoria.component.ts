import { Component, EventEmitter, Output } from '@angular/core';
import { Categoria } from '../../interfaces/interfaces';
import { CategoriaService } from '../categoria.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categoria',
  standalone: false,
  templateUrl: './categoria.component.html',
  styles: ``
})
export class CategoriaComponent {
  @Output() onDebounce: EventEmitter<string> = new EventEmitter(); // Emite el término de búsqueda con debounce

  categorias: Categoria[] = [];
  hayError: boolean = false;
  termino: string = '';
  errorAgregarCategoria: string | null = '';
  nuevaCategoria: Categoria = { id: 0, nombre: '' };
  mostrarFormularioEditar: boolean = false;
  mostrarFormularioAgregar: boolean = false;
  categoriaSeleccionada: Categoria = { id: 0, nombre: '' }

  private debouncer: Subject<string> = new Subject<string>(); // Subject para manejar el debounce
  private destroy$: Subject<void> = new Subject<void>(); // Subject para manejar la destrucción del componente

  constructor(private categoriaService: CategoriaService) { }

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
        this.hayError = false;
      },
      (err) => {
        this.categorias = [];
        this.hayError = true;
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
        this.mostrarFormularioAgregar = false; // Oculta el formulario
        this.nuevaCategoria = { id: 0, nombre: '' }; // Reinicia el formulario
      },
      (err) => {
        // Maneja los errores del servidor
        if (err.status === 400 && err.error.message === 'El nombre de la categoria ya está en la lista') {
          this.errorAgregarCategoria = 'El nombre de la categoria ya está en la lista';
        } else {
          this.errorAgregarCategoria = 'Error al agregar el usuario. Inténtalo de nuevo.';
        }
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

  // Muestra el formulario de edición y llena los datos
  mostrarFormularioEdicion(categoria: Categoria): void {
    this.mostrarFormularioEditar = true; // Muestra el formulario de editar
    this.mostrarFormularioAgregar = false; // Oculta el formulario de agregar
    this.categoriaSeleccionada = categoria;
    this.nuevaCategoria = { ...categoria }; // Copia los datos de la categoría seleccionada
  }

  // Cancela la edición y oculta el formulario
  cancelarEdicion(): void {
    this.mostrarFormularioEditar = false;
    this.categoriaSeleccionada = { id: 0, nombre: '' };
    this.nuevaCategoria = { id: 0, nombre: '' }; // Reinicia el formulario
    this.errorAgregarCategoria = null; // Limpia el mensaje de error
  }

  // Envía los cambios al servidor
  editarCategoria(categoria: Categoria): void {
    this.errorAgregarCategoria = null;

    // Validación de campos obligatorios
    if (!this.nuevaCategoria.nombre) {
      this.errorAgregarCategoria = 'Todos los campos son obligatorios.';
      return;
    }

    this.categoriaService.editarCategoria(categoria.id, this.nuevaCategoria).subscribe(
      (categoriaActualizado) => {
        // Actualiza la categoría en la lista
        const index = this.categorias.findIndex((c) => c.id === categoria.id);
        if (index !== -1) {
          this.categorias[index].nombre = this.nuevaCategoria.nombre;
        }
        this.cancelarEdicion(); // Oculta el formulario después de guardar
      },
      (err) => {

        this.errorAgregarCategoria = 'El nombre de la categoría ya está en uso';
      }
    );
  }

}
