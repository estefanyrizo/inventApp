export interface User {
    id: number;
      username: string;
      password: string;
      role: string;
    }

  export interface Categoria {
    id: number;
    nombre: string;
  }

  export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    categoriaId: number;
  }