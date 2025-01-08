const mongoose = require('mongoose');
const { OrderSchema } = require('./orders.js'); // Reutilizando o esquema de pedidos

// Modelo para pedidos arquivados
const PaidOrder = mongoose.model('PaidOrder', OrderSchema, 'paidOrders');

module.exports = PaidOrder;
