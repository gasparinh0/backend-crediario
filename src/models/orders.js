import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

const OrderSchema = new Schema({
  clientName: { type: String, required: true },
  creationDate: { type: Date, default: Date.now }, 
  expirationDate: { type: Date }, 
  products: { type: [ProductSchema], required: true },
});

const OrderModel = model('orders', OrderSchema);

export default OrderModel;
