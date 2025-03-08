import { Component, EventEmitter, Output, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Categoria, Producto } from '../../interfaces/interfaces';
import { ProductoService } from '../producto.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { CategoriaService } from '../../categoria/categoria.service';


@Component({
  selector: 'app-producto',
  standalone: false,
  templateUrl: './producto.component.html',
  providers: [ConfirmationService, MessageService],
})

export class ProductoComponent {
  @Output() onDebounce: EventEmitter<string> = new EventEmitter(); // Emite el término de búsqueda con debounce
  visibleE: boolean = false;
  visibleA: boolean = false;
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  termino: string = '';
  errorAgregarProducto: string | null = '';
  nuevoProducto: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: 0
  };
  productoSeleccionado: Producto = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: 0
  }

  private debouncer: Subject<string> = new Subject<string>(); // Subject para manejar el debounce
  private destroy$: Subject<void> = new Subject<void>(); // Subject para manejar la destrucción del componente

  constructor(private categoriaService: CategoriaService, private productoService: ProductoService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.listarCategorias();
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
  listarCategorias() {
    this.categoriaService.getCategorias().subscribe(
      (categorias) => {
        this.categorias = categorias;
      },
    );
  }
  obtenerCategoriaNombre(categoriaId: number): string {
    return this.categorias.find(cat => cat.id === categoriaId)?.nombre || 'Sin categoría';
  }

  listar() {
    this.productoService.getproductos().subscribe((productos) => {
      productos = productos.map(producto => ({
        categoria: this.obtenerCategoriaNombre(producto.categoriaId),
        ...producto
      }));
      this.productos = productos
    });
  }

  // Método para buscar usuarios por término
  buscar() {
    this.productoService.buscarProducto(this.termino).subscribe((productos) => {
      productos = productos.map(producto => ({
        categoria: this.obtenerCategoriaNombre(producto.categoriaId),
        ...producto
      }));
      this.productos = productos;
    });
  }
  // Método que se ejecuta cada vez que se presiona una tecla
  teclaPresionada() {
    this.debouncer.next(this.termino); // Emite el término de búsqueda al Subject
  }

  // Método para manejar las resultados
  resultados(termino: string) {

    // Aquí puedes hacer una solicitud HTTP para obtener resultados
    this.productoService.buscarProducto(termino).subscribe((productos) => {
      this.productos = productos; // Asigna los usuarios encontrados
      productos = productos.map(producto => ({
        categoria: this.obtenerCategoriaNombre(producto.categoriaId),
        ...producto
      }));
      this.productos = productos;
    });
  }

  // Método para agregar un nuevo usuario
  agregarProducto() {
    // Reinicia el mensaje de error
    this.errorAgregarProducto = null;

    // Llama al servicio para agregar el usuario
    this.productoService.agregarProducto(this.nuevoProducto).subscribe(
      (producto) => {
        this.visibleA = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto Agregado exitosamente',
        });
        this.listar();
      },
      (error) => {
        this.errorAgregarProducto = (error.error.message as string) || 'Error al agregar producto';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorAgregarProducto,
        });
      }
    );
  }

  // Muestra el formulario de edición y llena los datos
  mostrarFormularioEdicion(producto: Producto): void {
    this.visibleE = true;
    this.productoSeleccionado = producto;
    this.nuevoProducto = { ...producto }; // Copia los datos de la categoría seleccionada
  }

  // Cancela la edición y oculta el formulario
  reiniciarDatos(): void {
    this.productoSeleccionado = {
      id: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoriaId: 0
    };
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoriaId: 0
    }; // Reinicia el formulario
    this.errorAgregarProducto = null; // Limpia el mensaje de error
    this.visibleA = false;
    this.visibleE = false;
  }


  editarProducto(producto: Producto): void {
    this.errorAgregarProducto = null;

    this.productoService.editarProducto(producto.id, this.nuevoProducto).subscribe(
      () => {
        this.visibleE = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto actualizado correctamente',
        });
        this.listar();
      },
      (error) => {
        this.errorAgregarProducto = (error.error.message as string) || 'Error al editar producto';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorAgregarProducto,
        });
      }
    );
  }

}
