const ClientModel = require('../models/clients.js')

async function get(req, res) {
    try {
      const clients = await ClientModel.find({ userId: req.user.id });
      res.send(clients);
    } catch (error) {
      res.status(500).send({ message: 'Erro ao buscar clientes', error });
    }
  }
  
  async function post(req, res) {
    try {
      const { name, telephone } = req.body;
  
      if (!name || !telephone) {
        console.error('Faltando nome ou telefone:', req.body);
        return res.status(400).send({ message: 'Nome e telefone são obrigatórios.' });
      }
  
      if (!req.user || !req.user.id) {
        console.error('Usuário não autenticado ou sem ID:', req.user);
        return res.status(401).send({ message: 'Usuário não autenticado.' });
      }
  
      const client = new ClientModel({ name, telephone, userId: req.user.id });
      await client.save();
  
      res.send({ message: 'Cliente cadastrado com sucesso!', client });
    } catch (error) {
      console.error('Erro ao salvar cliente:', error); // Log detalhado do erro
      res.status(500).send({ message: 'Erro ao salvar cliente', error });
    }
  }

  async function put(req, res) {
    try {
      const { id } = req.params; // Obtém o ID dos parâmetros da rota
  
      // Atualiza o cliente com base no ID
      const client = await ClientModel.findOneAndUpdate(
        { _id: id },       // Filtro para encontrar o cliente pelo ID
        req.body,          // Dados de atualização (enviados no corpo da requisição)
        { new: true }      // Retorna o documento atualizado
      );
  
      // Caso o cliente não seja encontrado
      if (!client) {
        return res.status(404).send({ message: 'Cliente não encontrado' });
      }
  
      // Responde com sucesso
      res.send({
        message: 'Success!',
        client,
      });
    } catch (error) {
      // Trata erros durante a operação
      res.status(500).send({ message: 'Erro ao atualizar dados', error });
    }
  }
  
  async function remove(req, res) {
    try {
      const { id } = req.params
      
      const deletionResult = await ClientModel.deleteOne({ _id: id })
  
      const message = deletionResult.deletedCount = 1 ? 'success' : 'error'
  
      res.send({ 
          message, 
      })
    } catch (error) {
      res.status(500).send({ message: 'Erro ao apagar cliente', error })
    }
}
  
module.exports = {
    get,
    post,
    put,
    remove
}