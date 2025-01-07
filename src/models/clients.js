const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  telephone: { type: String, required: true },
});

module.exports = mongoose.model('clients', ClientSchema);
