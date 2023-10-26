const express = require('express')
const routerAccount = express.Router()
const routerTableController = require('../app/controllers/AccountController.js')
const { cookieAuthenticated } = require('../config/db/authenticated')
const { authenticatedAdmin } = require('../config/db/authenticatedAdmin')




routerAccount.route("/admin")
    .get(cookieAuthenticated, authenticatedAdmin, routerTableController.showAll)

routerAccount.route("/information")
    .put(cookieAuthenticated, routerTableController.putInformation)

routerAccount.route("/")
    .get(cookieAuthenticated, routerTableController.showOne)
    .put(cookieAuthenticated, routerTableController.put)

module.exports = routerAccount