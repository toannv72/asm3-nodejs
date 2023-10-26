const express = require('express')
const routerCreate = express.Router()
const routerReg = require('../app/controllers/RegController') 

routerCreate.post('/', routerReg.post)
routerCreate.get('/', routerReg.show)

module.exports = routerCreate