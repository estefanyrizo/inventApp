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