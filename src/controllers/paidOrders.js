const mongoose = require('mongoose');
const { OrdersModel } = require('../models/orders.js');
const PaidOrder = require('../models/paidOrders.js');

const archivePaidOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Verificar se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ error: 'ID do pedido inválido.' });
      }
  
      // Buscar o pedido
      const order = await OrdersModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }
  
      // Criar uma nova instância de `PaidOrder`
      const paidOrder = new PaidOrder(order.toObject());
  
      // Salvar em `paidOrders`
      await paidOrder.save();
  
      // Remover da coleção `orders`
      await OrdersModel.findByIdAndDelete(orderId);
  
      return res.status(200).json({ message: 'Pedido arquivado com sucesso!', paidOrder });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao arquivar pedido.' });
    }
  };

module.exports = {
    archivePaidOrder
}
