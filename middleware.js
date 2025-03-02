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

}