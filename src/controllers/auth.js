const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

async function postRegister(req,res) {
    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Usuário já registrado.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
      res.status(500).json({ error: 'Erro no servidor.' });
    }
}

async function postLogin(req,res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha inválida.' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token, message: 'Login bem-sucedido!' });
    } catch (error) {
      res.status(500).json({ error: 'Erro no servidor.' });
    }
}

module.exports = {
    postRegister,
    postLogin
}