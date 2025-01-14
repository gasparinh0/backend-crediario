const mongoose = require('mongoose');
const { OrdersModel } = require('../models/orders.js')

//Função auxiliar para formatar data
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

//Método GET para obter a lista de pedidos
async function get(req, res) {
    try {
        const orders = await OrdersModel.find({ userId: req.user.id })
        res.send(orders);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar pedidos', error });
    }
}

//Método POST para cadastrar pedidos
const post = async (req, res) => {
    try {
        const { clientName, creationDate, products } = req.body;

        if (!clientName || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'O nome do cliente e os produtos são obrigatórios.' });
        }

        // Garantir datas formatadas em DD/MM/YYYY
        const creation = creationDate
            ? formatDate(creationDate)
            : formatDate(new Date());

        const expiration = new Date(creationDate || Date.now());
        expiration.setDate(expiration.getDate() + 30);
        const expirationDate = formatDate(expiration);

        const processedProducts = products.map(product => {
            const { name, price, quantity } = product;
            if (!name || typeof price !== 'number' || typeof quantity !== 'number') {
                throw new Error('Cada produto deve ter nome, preço e quantidade válidos.');
            }
            const total = product.total ?? price * quantity;
            const createdAt = product.createdAt
                ? formatDate(product.createdAt)
                : formatDate(new Date());
            return { name, price, quantity, total, createdAt };
        });

        const order = new OrdersModel({
            clientName,
            creationDate: creation,
            expirationDate,
            products: processedProducts,
            userId: req.user.id
        });

        await order.save();

        return res.status(201).json(order);
    } catch (error) {
        console.error('Erro ao criar pedido:', error.message);
        return res.status(500).json({ error: 'Erro ao criar o pedido.' });
    }
};

//Método PATCH para adicionar produtos a um pedido
const patch = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { products } = req.body;

        if (!orderId || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'O ID do pedido e os produtos são obrigatórios.' });
        }

        const order = await OrdersModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        const newProducts = products.map(product => {
            const { name, price, quantity } = product;

            if (!name || typeof price !== 'number' || typeof quantity !== 'number') {
                throw new Error('Cada produto deve ter nome, preço e quantidade válidos.');
            }

            const total = product.total ?? price * quantity;
            const createdAt = product.createdAt
                ? formatDate(product.createdAt)
                : formatDate(new Date());

            return { name, price, quantity, total, createdAt };
        });

        // Adiciona os novos produtos ao array existente
        order.products.push(...newProducts);

        await order.save();

        return res.status(200).json(order);
    } catch (error) {
        console.error('Erro ao adicionar produtos ao pedido:', error.message);
        return res.status(500).json({ error: 'Erro ao adicionar produtos ao pedido.' });
    }
};

//Método PUT para atualizar informações de um produto em um pedido
const put = async (req, res) => {
    try {
        const { orderId, productId } = req.params;
        const { name, price, quantity } = req.body;

        // Verificar se os IDs são válidos
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'ID do pedido inválido.' });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'ID do produto inválido.' });
        }

        // Verificar se os dados necessários foram enviados
        if (!name || typeof price !== 'number' || typeof quantity !== 'number') {
            return res.status(400).json({
                error: 'Nome, preço e quantidade do produto são obrigatórios e devem ser válidos.',
            });
        }

        // Buscar o pedido pelo ID
        const order = await OrdersModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        // Encontrar o produto dentro do pedido
        const product = order.products.id(productId);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado no pedido.' });
        }

        // Atualizar os campos do produto
        product.name = name;
        product.price = price;
        product.quantity = quantity;
        product.total = price * quantity;

        // Salvar as alterações no banco de dados
        await order.save();

        return res.status(200).json(order);
    } catch (error) {
        console.error('Erro ao atualizar produto no pedido:', error.message);
        return res.status(500).json({ error: 'Erro ao atualizar produto no pedido.' });
    }
};

//Método DELETE para remover produtos de um pedido
const removeProduct = async (req, res) => {
    try {
        const { orderId, productId } = req.params;

        // Verificar se os IDs são válidos
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'ID do pedido inválido.' });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'ID do produto inválido.' });
        }

        // Buscar o pedido pelo ID
        const order = await OrdersModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        // Encontrar e remover o produto dentro do pedido
        const productIndex = order.products.findIndex(product => product._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Produto não encontrado no pedido.' });
        }

        // Remover o produto do array de produtos
        order.products.splice(productIndex, 1);

        // Salvar as alterações no banco de dados
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
    removeProduct
}