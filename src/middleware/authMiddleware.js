const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1]; // Extrai o token após "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token
    req.user = { id: decoded.id }; // Associa o ID do usuário ao req.user
    next(); // Continua para o próximo middleware ou rota
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(401).send({ message: 'Token inválido.' });
  }
}

module.exports = authenticate;
