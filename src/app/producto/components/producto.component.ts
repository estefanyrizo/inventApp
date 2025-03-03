import { Component, EventEmitter, Output } from '@angular/core';
import { Producto } from '../../interfaces/interfaces';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-producto',
  standalone: false,
  templateUrl: './producto.component.html',
})

export class ProductoComponent {
  @Output() onDebounce: EventEmitter<string> = new EventEmitter(); // Emite el término de búsqueda con debounce
  productos: Producto[] = [];
  hayError: boolean = false;
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
  mostrarFormularioEditar: boolean = false;
  mostrarFormularioAgregar: boolean = false;
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

  constructor(private productoService: ProductoService) { }

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

  // Método para obtener todos los productos
  listar() {
    this.productoService.getproductos().subscribe(
      (productos) => {
        this.productos = productos;
        this.hayError = false;
      },
      (err) => {
        this.productos = [];
        this.hayError = true;
      }
    );
  }

  // Método para buscar usuarios por término
  buscar() {
    this.productoService.buscarProducto(this.termino).subscribe(
      (productos) => {
        this.productos = productos;
        this.hayError = false;
      },
      (err) => {
        this.productos = [];
        this.hayError = true;
      }
    );
  }
  // Método que se ejecuta cada vez que se presiona una tecla
  teclaPresionada() {
    this.debouncer.next(this.termino); // Emite el término de búsqueda al Subject
  }

  // Método para manejar las resultados
  resultados(termino: string) {
    this.hayError = false; // Reinicia el estado de error

    // Aquí puedes hacer una solicitud HTTP para obtener resultados
    this.productoService.buscarProducto(termino).subscribe(
      (productos) => {
        this.productos = productos; // Asigna los usuarios encontrados
      },
      (err) => {
        this.productos = []; // Limpia la lista de usuarios en caso de error
      }
    );
  }

  // Método para agregar un nuevo usuario
  agregarProducto() {
    // Reinicia el mensaje de error
    this.errorAgregarProducto = null;

    if (!this.nuevoProducto.nombre && !this.nuevoProducto.precio && !this.nuevoProducto.stock && !this.nuevoProducto.categoriaId ) {
      this.errorAgregarProducto = 'Campos obligatorios';
      return;
    }

    // Llama al servicio para agregar el usuario
    this.productoService.agregarProducto(this.nuevoProducto).subscribe(
      (producto) => {
        this.productos.push(producto); // Agrega el nuevo usuario a la lista
        this.mostrarFormularioAgregar = false; // Oculta el formulario
        this.nuevoProducto = {
          id: 0,
          nombre: '',
          descripcion: '',
          precio: 0,
          stock: 0,
          categoriaId: 0
        }; // Reinicia el formulario
      },
      (err) => {
        // Maneja los errores del servidor
        if (err.status === 400 && err.error.message === 'El producto ya existe') {
          this.errorAgregarProducto = 'El producto ya existe';
        } else {
          this.errorAgregarProducto = 'Error al agregar el usuario. Inténtalo de nuevo.';
        }
      }
    );
  }
  // Muestra el formulario de edición y llena los datos
  mostrarFormularioEdicion(producto: Producto): void {
    this.mostrarFormularioEditar = true; // Muestra el formulario de editar
    this.mostrarFormularioAgregar = false; // Oculta el formulario de agregar
    this.productoSeleccionado = producto;
    this.nuevoProducto = { ...producto }; // Copia los datos de la categoría seleccionada
  }

  // Cancela la edición y oculta el formulario
  cancelarEdicion(): void {
    this.mostrarFormularioEditar = false;
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
  }


  editarProducto(producto: Producto): void {
    this.errorAgregarProducto = null;

    // Validación de campos obligatorios
    if (!this.nuevoProducto.nombre && !this.nuevoProducto.precio && !this.nuevoProducto.stock && !this.nuevoProducto.categoriaId ) {
      this.errorAgregarProducto = 'Campos obligatorios';
      return;
    }

    this.productoService.editarProducto(producto.id, this.nuevoProducto).subscribe(
      (productoActualizado) => {
        // Actualiza la categoría en la lista
        const index = this.productos.findIndex((c) => c.id === producto.id);
        if (index !== -1) {
          this.productos[index].nombre = this.nuevoProducto.nombre;
          this.productos[index].precio = this.nuevoProducto.precio;
          this.productos[index].stock = this.nuevoProducto.stock;
          this.productos[index].categoriaId = this.nuevoProducto.categoriaId;
          if(this.productoSeleccionado.descripcion){
            this.productos[index].descripcion = this.nuevoProducto.descripcion;
          }
        }
        this.cancelarEdicion(); // Oculta el formulario después de guardar
      },
      (err) => {

        this.errorAgregarProducto = 'El nombre del producto ya está en uso';
      }
    );
  }

}
