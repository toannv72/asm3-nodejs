const express = require('express')
const routerCategory = express.Router()
const routerTableController = require('../app/controllers/CategoryController')
const { cookieAuthenticated } = require('../config/db/authenticated')
const { authenticatedAdmin } = require('../config/db/authenticatedAdmin')


routerCategory
    .put('/:id', cookieAuthenticated, authenticatedAdmin, routerTableController.put)
routerCategory
    .delete('/:id', cookieAuthenticated, authenticatedAdmin, routerTableController.delete)

routerCategory.route("/")
    .get(cookieAuthenticated, authenticatedAdmin, routerTableController.show)
    .post(cookieAuthenticated, authenticatedAdmin, routerTableController.post)

module.exports = routerCategory