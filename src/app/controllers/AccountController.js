
const { mutipleMongooseToObject, mongoosesToObject } = require('../../util/mongoose');
const Token = require('../../config/db/config');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

class AccountController {

    putInformation(req, res, next){
        var checkTokenValid = jwt.verify(req.cookies.accessToken, Token.refreshToken);
        User.findByIdAndUpdate(checkTokenValid.user._id,  req.body )
            .then((e)=> {
                User.findById(checkTokenValid.user._id)
                .then((account) => {
                    return res.render('view/account',
                        {
                            account: mongoosesToObject(account),
                            login: true,
                            Message: "Your account has been updated"
                        })
                })
            })
    }

    put(req, res, next) {
        const formData = req.body
        var checkTokenValid = jwt.verify(req.cookies.accessToken, Token.refreshToken);
        User.findById(checkTokenValid.user._id)
        .then((user) => {
            bcrypt.compare(formData.password, user.password, function (err, check) {
                if (check) {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(formData.newPassword, salt);
                        formData.newPassword = hash
                        User.findByIdAndUpdate(checkTokenValid.user._id, { password: formData.newPassword }, { new: true })
                            .then(courses => {
                                var token = jwt.sign({ user }, Token.refreshToken);
                                res.cookie("accessToken", token);
                                User.findById(checkTokenValid.user._id)
                                    .then((account) => {
                                        return res.render('view/account',
                                            {
                                                account: mongoosesToObject(account),
                                                login: true,
                                                Message: "Your account has been updated"
                                            })
                                    })
                            })
                            .catch(next => {
                                res.json(next)
                            })

                    } else {
                        console.log(1111111111,checkTokenValid.user._id);

                        User.findById(checkTokenValid.user._id)
                        .then((account) => {
                            return res.render('view/account',
                                {
                                    account: mongoosesToObject(account),
                                    login: true,
                                    Message: "Incorrect password"
                                })
                        })
                        
                    }
                });

            })
            .catch(error => {
                res.status(500).json(error)
            })

    }

    showAll(req, res, next) {

        User.find({isAdmin:"false"})
            .then((account) => {
                return res.render('view/accountAdmin',
                    {
                        account: mutipleMongooseToObject(account),
                        login: true,
                    })
            })

    }
    showOne(req, res, next) {
        var checkTokenValid = jwt.verify(req.cookies.accessToken, Token.refreshToken);

        User.findById(checkTokenValid.user._id)
            .then((account) => {
                return res.render('view/account',
                    {
                        account: mongoosesToObject(account),
                        login: true,
                    })
            })
    }
    post(req, res, next) {


    }

}
module.exports = new AccountController;
