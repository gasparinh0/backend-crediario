//A boa prática é sempre chamar as dependencias que foram instaladas, depois as qual você criou no projeto.
//dependencias instaladas
const express = require('express');
const cors = require('cors');

//importando env
require('dotenv').config();

//dependencias criadas
const db = require('./database/db');
const routes = require('./routes/routes');

const app = express();

//conexão com o banco de dados
db.connect()

const allowedOrigins = [
    'http://localhost:5173',
 ];
 
 // Habilitando o CORS
 app.use(cors({
     origin: function (origin, callback) {
         if (!origin || allowedOrigins.indexOf(origin) !== -1) {
             callback(null, true);
         } else {
             callback(new Error('Not allowed by CORS'));
         }
     }
 }));

//habilita server para receber dados em formato json
app.use(express.json())

//Definindo as rotas
app.use('/api', routes)

//Executando o servidor
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server is listening on port ${port}`))