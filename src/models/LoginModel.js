const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
  constructor(body){
    this.body = body
    this.errors = []
    this.user = null
  }
  
  async register() {
    this.valida()
    if(this.errors.length > 0) return

    // checking if exist an user
    await this.userExists()

    if(this.errors.length > 0) return

    // crypting password
    const salt = bcryptjs.genSaltSync()
    this.body.password = bcryptjs.hashSync(this.body.password, salt)

    try {
      // creating user
      this.user = await LoginModel.create(this.body)
    } catch(e) {
      console.log(e)
    }
  }

  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email })
    if(user) this.errors.push('Usuário já existe!')
  }

  valida() {
    this.cleanUp()

    // O e-mail precisa ser válido
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido!')
    // A senha precisa ter entre 3 e 20 caracteres
    if(this.body.password < 3 || this.body.password.lenght > 12) {
      this.errors.push('A senha precisa ter entre 3 e 12 caracteres.')
    }
  }

  cleanUp() {
    for(let key in this.body){
      if(typeof this.body[key] !== 'string') {
        this.body[key] = ''
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login