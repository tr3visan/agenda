// Configuração de rotas com Express
const express = require('express')
const route = express.Router()

// importando os controllers
const homeController = require('./src/controllers/homeController')
const contatoController = require('./src/controllers/contatoController')

// rotas da home
route.get('/', homeController.paginaInicial)
route.post('/', homeController.trataPost)

// rotas de contato
route.get('/contato', contatoController.paginaInicial)

// exportando o route
module.exports = route