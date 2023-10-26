const routerLogin = require("./login");
const routerReg = require("./reg");
const routerHome = require("./home");
const router404 = require("./Error404");
const routerLogout = require("./logout");
const routerOrchid = require("./orchid");
const routerCategory = require("./category");
const routerAccount = require("./Account");

module.exports = function (app) {
  app.use('/login', routerLogin)
  app.use('/logout', routerLogout)
  app.use('/reg', routerReg)

  app.use('/orchid', routerOrchid)
  app.use('/category', routerCategory)

  
  app.use('/account', routerAccount)
  app.use('/', routerHome)
  app.use('*', router404)
  
};