const mongoose = require('mongoose');

// Esquema do Usuário
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Modelo de Usuário
const User = mongoose.model('User', UserSchema);

module.exports = User;
