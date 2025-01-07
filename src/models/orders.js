const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
})

const OrderSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  creationDate: { type: Date, default: Date.now }, 
  expirationDate: { type: Date }, 
  products: { type: [ProductSchema], required: true },
})


const OrderModel = mongoose.model('orders', OrderSchema)

module.exports = OrderModel
