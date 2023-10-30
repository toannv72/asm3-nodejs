const express = require('express')
const routerOrchid = express.Router()
const routerTableController = require('../app/controllers/OrchidController')
const { cookieAuthenticated } = require('../config/db/authenticated')
const { authenticatedAdmin } = require('../config/db/authenticatedAdmin')



routerOrchid.route("/comment/:orchidID/:commentId")
    .delete(cookieAuthenticated, routerTableController.deleteComments)

routerOrchid.route("/comments/:id")
    .post(cookieAuthenticated, routerTableController.comments)
routerOrchid
    .put('/:id', cookieAuthenticated, authenticatedAdmin, routerTableController.put)
routerOrchid
    .delete('/:id', cookieAuthenticated, authenticatedAdmin, routerTableController.delete)

routerOrchid.route("/search")
    .get(cookieAuthenticated, authenticatedAdmin, routerTableController.search)

routerOrchid.route("/")
    .get(cookieAuthenticated, authenticatedAdmin, routerTableController.show)
    .post(cookieAuthenticated, authenticatedAdmin, routerTableController.post)

module.exports = routerOrchid