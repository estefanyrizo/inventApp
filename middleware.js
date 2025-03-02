const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const SECRET_KEY = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'; 

const dbPath = path.join(__dirname, 'db.json');

const readDb = () => {
  const data = fs.readFileSync(dbPath, 'utf-8'); // Lee db.json
  return JSON.parse(data);
};
const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); // Escribe en db.json
};

module.exports = (req, res, next) => {
  const { method, url, body, query, params, headers} = req;

  if (url === '/login' && method === 'POST') {
    const { username, password } = body;

    // Leer los usuarios desde db.json
    const db = readDb();
    const user = db.users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY, 
      { expiresIn: '1h' } 
    );

    return res.status(200).json({ token }); 
  }

// Verificar si el token es valido
  const verifyToken = (token) => {
    try {
      // Verifica la firma del token
      const decoded = jwt.verify(token, SECRET_KEY);
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
  const { username, password, role } = body;

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

  const { role } = body;
  if (!role || (role !== 'admin' && role !== 'user')) {
    return res.status(400).json({ message: 'Rol no válido. Debe ser "admin" o "user".' });
  }

  const db = readDb();
  const users = db.users;

  const usuario = users.find((u) => u.id === userId);
  if (!usuario) {
    return res.status(404).json({ message: `Usuario con ID ${userId} no encontrado` });
  }

  usuario.role = role;
  writeDb(db);

  return res.status(200).json(usuario);
}
