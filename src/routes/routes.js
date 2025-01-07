const router = require('express').Router();
const clientsController = require('../controllers/clients.js');

// Rotas para Clientes
router.get('/clients/:id?', clientsController.get);
router.post('/clients', clientsController.post);
router.put('/clients/:id', clientsController.put);
router.delete('/clients/:id', clientsController.remove);

//Rotas para Pedidos (Orders)


module.exports = router