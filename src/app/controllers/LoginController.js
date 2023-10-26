
const { mutipleMongooseToObject, mongoosesToObject } = require('../../util/mongoose');
const User = require('../models/User');
var bcrypt = require('bcryptjs');
const Token = require('../../config/db/config');
var jwt = require('jsonwebtoken');
const url = require('url');
class loginControllers {
    post(req, res, next) {
        // lấy đường dẫn trước khi post 
        const referer = req.headers.referer || null;
        // show ra thông báo 
        const sess = req.session;
        req.session.errorMessage = 'Wrong account or password. Please try again.';
        const formData = req.body
        req.session.userName=req.body.username;
        // console.log(req.Symbol(kHeaders));
        const parsedUrl = new url.URL(referer);
        const path = parsedUrl.pathname;
        User.findOne({ username: formData.username })
            .then((user) => {
                user === null ? res.redirect(path) :
                    bcrypt.compare(formData.password, user.password, function (err, check) {
                        if (check) {
                            // var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (10), user }, 'shhhhh');
                            var token = jwt.sign({ user }, Token.refreshToken, { expiresIn: '10h' });
                            res.cookie("accessToken", token);
                            if (referer) {
                                // lấy đường đãn trước đó của wed 
                                const parsedUrl = new url.URL(referer);
                                const path = parsedUrl.pathname;
                                if (parsedUrl.pathname === "/login") {
                                    req.session.errorMessage = '';
                                    return res.redirect("/");
                                }
                                req.session.errorMessage = '';
                                return res.redirect("back");
                            } else {
                                req.session.errorMessage = '';
                                return res.redirect("/");
                            }
                        } else {
                            if (referer) {
                                // lấy đường đãn trước đó của wed 
                                const parsedUrl = new url.URL(referer);
                                const path = parsedUrl.pathname;
                                res.redirect(path)
                            }
                        }
                    });
                // res.json(user)

            })
            .catch(next => {
                // res.send(`error`)
                sess.errorMessage = 'Wrong account or password please try again!'
                res.status(500).render('view/login/login')

            })
    }
    show(req, res) {
        const sess = req.session;  //initialize session variable
        const errorMessage = sess.errorMessage || '';
        const userName = sess.userName || '';
        sess.errorMessage = '';
        sess.userName = '';
        // res.clearCookie("accessToken");
        res.render('view/login/login', {
            login: false,
            errorMessage,
            userName
        })
    }
}
module.exports = new loginControllers;
