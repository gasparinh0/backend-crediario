const { OrdersModel } = require('../models/orders.js');

// Função auxiliar para formatar data
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

// Método GET para obter a lista de pedidos
async function get(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const orders = await OrdersModel.find({ userId: req.user.id });
        res.send(orders);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar pedidos', error });
    }
}

// Método POST para cadastrar pedidos
const post = async (req, res) => {
    try {
        const { clientName, creationDate, products } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        if (!clientName || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'O nome do cliente e os produtos são obrigatórios.' });
        }

        const creation = creationDate ? formatDate(creationDate) : formatDate(new Date());

        const expiration = new Date(creationDate || Date.now());
        expiration.setDate(expiration.getDate() + 30);
        const expirationDate = formatDate(expiration);

        const processedProducts = products.map(product => {
            const { name, price, quantity } = product;
            if (!name || typeof price !== 'number' || typeof quantity !== 'number') {
                throw new Error('Cada produto deve ter nome, preço e quantidade válidos.');
            }
            const total = product.total ?? price * quantity;
            const createdAt = product.createdAt ? formatDate(product.createdAt) : formatDate(new Date());
            return { name, price, quantity, total, createdAt };
        });

        const order = new OrdersModel({
            clientName,
            creationDate: creation,
            expirationDate,
            products: processedProducts,
            userId: req.user.id,
        });

        await order.save();
        return res.status(201).json(order);
    } catch (error) {
        console.error('Erro ao criar pedido:', error.message);
        return res.status(500).json({ error: 'Erro ao criar o pedido.' });
    }
};

// Método PATCH para adicionar produtos a um pedido
const patch = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { products } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const order = await OrdersModel.findOne({ _id: orderId, userId: req.user.id });
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado ou acesso não autorizado.' });
        }

        const newProducts = products.map(product => {
            const { name, price, quantity } = product;
            if (!name || typeof price !== 'number' || typeof quantity !== 'number') {
                throw new Error('Cada produto deve ter nome, preço e quantidade válidos.');
            }
            const total = product.total ?? price * quantity;
            const createdAt = product.createdAt ? formatDate(product.createdAt) : formatDate(new Date());
            return { name, price, quantity, total, createdAt };
        });

        order.products.push(...newProducts);
        await order.save();

        return res.status(200).json(order);
    } catch (error) {
        console.error('Erro ao adicionar produtos ao pedido:', error.message);
        return res.status(500).json({ error: 'Erro ao adicionar produtos ao pedido.' });
    }
};

// Método PUT para atualizar informações de um produto em um pedido
const put = async (req, res) => {
    try {
        const { orderId, productId } = req.params;
        const { name, price, quantity } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const order = await OrdersModel.findOne({ _id: orderId, userId: req.user.id });
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado ou acesso não autorizado.' });
        }

        const product = order.products.id(productId);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado no pedido.' });
        }

        product.name = name;
        product.price = price;
        product.quantity = quantity;
        product.total = price * quantity;

        await order.save();

        return res.status(200).json(order);
    } catch (error) {
        console.error('Erro ao atualizar produto no pedido:', error.message);
        return res.status(500).json({ error: 'Erro ao atualizar produto no pedido.' });
    }
};

// Método DELETE para remover produtos de um pedido
const removeProduct = async (req, res) => {
    try {
        const { orderId, productId } = req.params;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const order = await OrdersModel.findOne({ _id: orderId, userId: req.user.id });
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado ou acesso não autorizado.' });
        }

        const productIndex = order.products.findIndex(product => product._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Produto não encontrado no pedido.' });
        }

        order.products.splice(productIndex, 1);
        await order.save();

        return res.status(200).json({ message: 'Produto removido com sucesso!', order });
    } catch (error) {
        console.error('Erro ao remover produto do pedido:', error.message);
        return res.status(500).json({ error: 'Erro ao remover produto do pedido.' });
    }
};

module.exports = {
    get,
    post,
    patch,
    put,
    removeProduct,
};
