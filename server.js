// informações secretas
require('dotenv').config()

// Iniciando express
const express = require('express')
const app = express()

// Iniciando o mongoose para modelar os dados p/ o db
const mongoose = require('mongoose')
// Iniciando a conexão com o bd que retorna uma promisse
mongoose.connect(process.env.CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => { app.emit('pronto')}).catch(e => console.log(e))


// inciando sessões com informações do cliente
// através dos dados inseridos no navegador do mesmo. Ex:"cookie"
const session = require('express-session')
// Salvando as sessions na basa de dados
const MongoStore = require('connect-mongo')(session)
// Flash messeges. Passa uma msg e já some
const flash = require('connect-flash')

// Configurando as rotas e path dos arquivos
const routes = require('./routes')
const path = require('path')

// config helmet é necessário para segurança
const helmet = require('helmet')
// csrf tokens para segurança dos forms
const csrf = require('csurf')
const { middlewareGlobal, checkError, csrfMiddleware } = require('./src/middlewares/middleware')

// configurando a session
const sessionOptions = session({
  secret: 'teste',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
})
app.use(sessionOptions)
app.use(flash())

app.use(helmet())
// permite receber informações dos formulários
app.use(express.urlencoded({ extended: true }))
// já faz o parse de dados em json para dentro da aplicação
app.use(express.json())
// lendo arquivos estáticos do site que podem ser acessados diretamente
app.use(express.static(path.resolve(__dirname, 'public')))

// iniciando, protegendo contra ataques
app.use(csrf())
// Configurando meus Middlwares
app.use(middlewareGlobal)
// Segurança
app.use(checkError)
app.use(csrfMiddleware)


// Configurando para exibir as Views
app.set('views', path.resolve(__dirname, 'src', 'views'))
// view engine = para renderizar arquivos ejs
app.set('view engine', 'ejs')

// usando routes
app.use(routes)

// se o app.emit() for app.emit('pronto) inicia a aplicação
app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Server http://localhost:3000')
  })
})
