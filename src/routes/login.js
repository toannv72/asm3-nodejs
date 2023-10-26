const express = require('express')
const routerCreate = express.Router()
const routerLogin = require('../app/controllers/LoginController')

routerCreate
    .route("/")
    .post( routerLogin.post)
    
routerCreate.get('/', routerLogin.show)

module.exports = routerCreate