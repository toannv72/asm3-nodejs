var jwt = require("jsonwebtoken");

var Token = require("./config");

module.exports = {
  authenticatedAdmin: function (req, res, next) {
    if (req.cookies.accessToken) {
      try {
        var checkTokenValid = jwt.verify(req.cookies.accessToken, Token.refreshToken);
        if (checkTokenValid.user.isAdmin) {
          return next();
        }
        else {
          // res.redirect("/login");
          // res.send("khong co quyen truy cap")
          return res.render('view/inaccessible', {
            login: true
          })
        }
      } catch (err) {
        return res.redirect("/login");
      }
    }
    res.redirect("/login");
  },
};
