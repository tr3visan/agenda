// Configuração de rotas com Express
const express = require('express')
const route = express.Router()

// importando os controllers
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')


// rotas da home
route.get('/', homeController.index)

// rotas de login
route.get('/login/index', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)


// exportando o route
module.exports = route