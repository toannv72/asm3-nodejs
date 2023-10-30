const express = require('express')
const routerHome = express.Router()
const HomeController = require('../app/controllers/HomeController') 
const { cookieAuthenticated } = require('../config/db/authenticated')

routerHome.get('/orchid/:id',cookieAuthenticated, HomeController.getOne)
routerHome.get('/', HomeController.index)

module.exports = routerHome