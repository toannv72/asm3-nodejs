const express = require('express')
const routerLogout = express.Router()
const controllersLogout = require('../app/controllers/LogoutController')

routerLogout
    .route("/")
    .get( controllersLogout.post)
    

module.exports = routerLogout