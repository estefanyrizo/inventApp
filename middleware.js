const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const SECRET_KEY = '6b9f3b0bfe1ed2c3fcb4d39f0f7e2789a7ed457a1abf9f1b285a96b9c59bdb0b75d8a1f67c6e9b9d9ff4d7f56e4c66a73d72d5c8e2c6f99e8fa70d4593858bda1';

const dbPath = path.join(__dirname, 'db.json');

const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = (req, res, next) => {
  const { method, url, body, query, headers } = req;

  if (url === '/login' && method === 'POST') {
    const { username, password } = body;

    const db = readDb();
    const user = db.users.find((u) => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, estado: user.estado },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  }

  const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log('Token válido:', decoded);
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.error('Token expirado:', error.message);
      } else if (error.name === 'JsonWebTokenError') {
        console.error('Token inválido:', error.message);
      } else {
        console.error('Error al verificar el token:', error);
      }
      return false;
    }
  };

  if (url === '/verifyToken' && method === 'POST') {
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    if (!verifyToken(token)) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    return res.status(200).json({ message: 'Token valido' });
  }

  if (url.startsWith('/users') && method === 'GET') {
    const db = readDb();
    const users = db.users;

    if (query.username) {
      const searchName = query.username.toLowerCase();
      const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchName)
      );

      if (filteredUsers.length > 0) {
        return res.status(200).json(filteredUsers);
      } else {
        return res.status(404).json({ message: 'No se encontraron usuarios con ese nombre' });
      }
    }

    return res.status(200).json(users);
  }

  if (url === '/users' && method === 'POST') {
    const { username, password, role, estado } = body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const db = readDb();
    const users = db.users;

    const usuarioExistente = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const nuevoUsuario = {
      id: users.length + 1,
      username,
      password,
      role,
      estado,
    };

    users.push(nuevoUsuario);
    writeDb(db);

    return res.status(201).json(nuevoUsuario);
  }

  if (method === 'PATCH' && url.startsWith('/users/')) {
    const userId = parseInt(url.split('/')[2], 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario no válido' });
    }

    const { role, estado } = body;
    const db = readDb();
    const users = db.users;

    const usuario = users.find((u) => u.id === userId);
    if (!usuario) {
      return res.status(404).json({ message: `Usuario con ID ${userId} no encontrado` });
    }

    if (role) {
      if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({ message: 'Rol no válido. Debe ser "admin" o "user".' });
      }
      usuario.role = role;
    }

    if (estado) {
      if (estado !== 'activo' && estado !== 'inactivo') {
        return res.status(400).json({ message: 'Estado no válido. Debe ser "activo" o "inactivo".' });
      }
      usuario.estado = estado;
    }

    if (!role && !estado) {
      return res.status(400).json({ message: 'Debe proporcionar "role" o "estado" para actualizar.' })
    }

    writeDb(db);

    return res.status(200).json(usuario);
  }

  if (url.startsWith('/categorias') && method === 'GET') {
    const db = readDb();
    const categorias = db.categorias;

    if (query.nombre) {
      const searchName = query.nombre.toLowerCase();
      const filteredCategorias = categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(searchName)
      );

      if (filteredCategorias.length > 0) {
        return res.status(200).json(filteredCategorias);
      } else {
        return res.status(404).json({ message: 'No se encontraron categorias con ese nombre' });
      }
    }

    return res.status(200).json(categorias);
  }

  if (url === '/categorias' && method === 'POST') {
    const { nombre } = body;

    if (!nombre) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const db = readDb();
    const categorias = db.categorias;

    const categoriaExistente = categorias.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase());

    if (categoriaExistente) {
      return res.status(400).json({ message: 'El nombre de la categoria ya está en la lista' });
    }

    const nuevaCategoria = {
      id: categorias.length + 1,
      nombre,
    };

    categorias.push(nuevaCategoria);
    writeDb(db);

    return res.status(201).json(nuevaCategoria);
  }

  if (method === 'PATCH' && url.startsWith('/categorias/')) {
    const categoriaId = parseInt(url.split('/')[2], 10);

    if (isNaN(categoriaId)) {
      return res.status(400).json({ message: 'ID de categoría no válido' });
    }

    const db = readDb();
    const categorias = db.categorias;

    const categoriaIndex = categorias.findIndex((c) => c.id === categoriaId);
    if (categoriaIndex === -1) {
      return res.status(404).json({ message: `Categoría con ID ${categoriaId} no encontrada` });
    }

    const categoriaActual = categorias[categoriaIndex];

    const { nombre } = body;
    if (!nombre) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    if (categoriaActual.nombre.toLowerCase() === nombre.toLowerCase()) {
      return res.status(200).json({ message: 'No se realizaron cambios.' });
    }

    const nombreExistente = categorias.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id !== categoriaId);
    if (nombreExistente) {
      return res.status(400).json({ message: 'El nombre de la categoría ya está en uso' });
    }

    categorias[categoriaIndex].nombre = nombre;
    writeDb(db);

    return res.status(200).json(categorias[categoriaIndex]);
  }

  if (url.startsWith('/productos') && method === 'GET') {
    const db = readDb();
    const productos = db.productos;

    if (query.nombre) {
      const searchName = query.nombre.toLowerCase();
      const filteredProductos = productos.filter((productos) =>
        productos.nombre.toLowerCase().includes(searchName)
      );

      if (filteredProductos.length > 0) {
        return res.status(200).json(filteredProductos);
      } else {
        return res.status(404).json({ message: 'No se encontraron productos con ese nombre' });
      }
    }

    return res.status(200).json(productos);
  }

  if (url === '/productos' && method === 'POST') {
    const { nombre, descripcion, precio, stock, categoriaId } = body;

    if (!nombre || !precio || !categoriaId) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const db = readDb();
    const productos = db.productos;

    const productoExistente = productos.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase(),);

    if (productoExistente) {
      return res.status(400).json({ message: 'El producto ya existe' });
    }

    const nuevoProducto = {
      id: productos.length + 1,
      nombre, descripcion, precio, stock, categoriaId
    };

    productos.push(nuevoProducto);
    writeDb(db);

    return res.status(201).json(nuevoProducto);
  }
  if (method === 'PATCH' && url.startsWith('/productos/')) {
    const productoId = parseInt(url.split('/')[2], 10);

    if (isNaN(productoId)) {
      return res.status(400).json({ message: 'ID de productos no válido' });
    }

    const db = readDb();
    const productos = db.productos;

    const productoIndex = productos.findIndex((c) => c.id === productoId);
    if (productoIndex === -1) {
      return res.status(404).json({ message: `productos con ID ${productoId} no encontrado` });
    }

    const { nombre, descripcion, precio, stock, categoriaId } = body;
    if (!nombre && !precio && !categoriaId) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    const nombreExistente = productos.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id !== productoId);
    if (nombreExistente) {
      return res.status(400).json({ message: 'El nombre del producto ya está en uso' });
    }

    productos[productoIndex].nombre = nombre;
    writeDb(db);

    return res.status(200).json({ mensaje: 'Producto Actualizado' });
  }

};
