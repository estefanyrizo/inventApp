export interface User {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'user';
  estado: 'activo' | 'inactivo';
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
  stock?: number;
  categoriaId: number;
}

export interface DbSchema {
  users: User[];
  categorias: Categoria[];
  productos: Producto[];
}

export interface TokenPayload {
  id: number;
  username: string;
  role: 'admin' | 'user';
}