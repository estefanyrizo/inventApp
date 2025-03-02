const jwt = require('jsonwebtoken');
const fs = require('fs'); // Módulo para manejar archivos
const path = require('path'); // Módulo para manejar rutas de archivos
const SECRET_KEY = 'tu-clave-secreta'; // Cambia esto por una clave segura

// Ruta al archivo db.json
const dbPath = path.join(__dirname, 'db.json');

// Función para leer el archivo db.json
const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

// Función para escribir en el archivo db.json
const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = (req, res, next) => {
  const { method, url, body, query, params, headers} = req;

  // Simula un endpoint de login
  if (url === '/login' && method === 'POST') {
    const { username, password } = body;

    // Lee los usuarios desde db.json
    const db = readDb();
    const user = db.users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Genera un token JWT que incluye el rol del usuario
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role }, // Payload (datos del usuario)
      SECRET_KEY, // Clave secreta
      { expiresIn: '1h' } // Expira en 1 hora
    );

    // Devuelve el token al cliente
    return res.status(200).json({ token });
  }
  const verifyToken = (token) => {
    try {
      // Verifica la firma del token
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log('Token válido:', decoded);
      return true;
    } catch (error) {
      // Manejo de errores específicos
      if (error.name === 'TokenExpiredError') {
        console.error('Token expirado:', error.message);
      } else if (error.name === 'JsonWebTokenError') {
        console.error('Token inválido:', error.message);
      } else {
        console.error('Error al verificar el token:', error);
      }
      return false;
    }
  }

  if (url === '/verifyToken' && method === 'POST') {
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; // Extrae el token del encabezado

    if (!verifyToken(token)) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    return res.status(200).json({message: 'Token valido'});
  }


  // Ruta para obtener todos los usuarios o buscar por nombre
  if (url.startsWith('/users') && method === 'GET') {
    const db = readDb();
    const users = db.users;

    // Verifica si se proporcionó un parámetro de consulta "username"
    if (query.username) {
      const searchName = query.username.toLowerCase(); // Convierte el nombre a minúsculas para una búsqueda insensible a mayúsculas
      const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchName)
      );

      // Verifica si hay usuarios que coincidan con la búsqueda
      if (filteredUsers.length > 0) {
        // Devuelve los usuarios filtrados
        return res.status(200).json(filteredUsers);
      } else {
        // Devuelve un error 404 si no se encontraron coincidencias
        return res.status(404).json({ message: 'No se encontraron usuarios con ese nombre' });
      }
    }

    // Si no se proporciona un nombre, devuelve todos los usuarios
    return res.status(200).json(users);
  }

  // Ruta para agregar un nuevo usuario
  if (url === '/users' && method === 'POST') {
    const { username, password, role } = body;

    // Validación básica de los datos
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Lee los usuarios desde db.json
    const db = readDb();
    const users = db.users;

    // Verifica si el usuario ya existe
    const usuarioExistente = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Crea un nuevo usuario
    const nuevoUsuario = {
      id: users.length + 1, // Genera un ID incremental
      username,
      password,
      role,
    };

    // Agrega el nuevo usuario a la lista
    users.push(nuevoUsuario);

    // Guarda los cambios en db.json
    writeDb(db);

    // Devuelve el nuevo usuario
    return res.status(201).json(nuevoUsuario);
  }

  // Ruta para cambiar el rol de un usuario
  if (method === 'PATCH' && url.startsWith('/users/')) {
    // Extraer el ID de la URL
    const userId = parseInt(url.split('/')[2], 10);

    // Validar que el ID sea un número válido
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario no válido' });
    }

    // Validar que el rol esté presente y sea válido
    const { role } = body;
    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).json({ message: 'Rol no válido. Debe ser "admin" o "user".' });
    }

    // Leer la base de datos
    const db = readDb();
    const users = db.users;

    // Buscar el usuario por ID
    const usuario = users.find((u) => u.id === userId);
    if (!usuario) {
      return res.status(404).json({ message: `Usuario con ID ${userId} no encontrado` });
    }

    // Actualizar el rol del usuario
    usuario.role = role;

    // Guardar los cambios en la base de datos
    writeDb(db);

    // Devolver el usuario actualizado
    return res.status(200).json(usuario);
  }
  //  fin de usuario

};