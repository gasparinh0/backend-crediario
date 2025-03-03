const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: String, default: Date.now },
})

const OrderSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  creationDate: { type: String, default: Date.now }, 
  expirationDate: { type: String }, 
  products: { type: [ProductSchema], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
})


const OrdersModel = mongoose.model('orders', OrderSchema)

module.exports = { OrdersModel, OrderSchema }
