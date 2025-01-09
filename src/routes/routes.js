const router = require("express").Router();
const clientsController = require("../controllers/clients.js");
const ordersController = require("../controllers/orders.js");
const paidOrdersController = require("../controllers/paidOrders.js");
const authController = require("../controllers/auth.js");
const authMiddleware = require("../middleware/authMiddleware.js");

// Rotas para Clientes (Proteger todas as rotas com authMiddleware)
router.get("/clients/:id?", authMiddleware, clientsController.get);
router.post("/clients", authMiddleware, clientsController.post);
router.put("/clients/:id", authMiddleware, clientsController.put);
router.delete("/clients/:id", authMiddleware, clientsController.remove);

// Rotas para Pedidos (Proteger todas as rotas relacionadas a pedidos)
router.get("/orders/:id?", authMiddleware, ordersController.get);
router.post("/orders", authMiddleware, ordersController.post);
router.patch("/orders/:orderId/products", authMiddleware, ordersController.patch);
router.put("/orders/:orderId/products/:productId", authMiddleware, ordersController.put);
router.delete("/orders/:orderId/products/:productId", authMiddleware, ordersController.removeProduct);
router.post("/orders/:orderId/archive", authMiddleware, paidOrdersController.archivePaidOrder);

// Rotas para Autenticação (Registro e Login não precisam de autenticação)
router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);

module.exports = router;
