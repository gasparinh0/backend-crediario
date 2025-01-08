const router = require('express').Router();
const clientsController = require('../controllers/clients.js');
const ordersController = require('../controllers/orders.js')

// Rotas para Clientes
router.get('/clients/:id?', clientsController.get);
router.post('/clients', clientsController.post);
router.put('/clients/:id', clientsController.put);
router.delete('/clients/:id', clientsController.remove);

//Rotas para Pedidos (Orders)
router.get('/orders/:id?', ordersController.get)
router.post('/orders', ordersController.post)
router.patch('/orders/:orderId/products', ordersController.patch)
router.put('/orders/:orderId/products/:productId', ordersController.put);
router.delete('/orders/:orderId/products/:productId', ordersController.removeProduct);
router.delete('/orders/:id', ordersController.remove);


module.exports = router