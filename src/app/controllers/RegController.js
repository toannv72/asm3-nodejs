
const { mutipleMongooseToObject, mongoosesToObject } = require('../../util/mongoose');
const User = require('../models/User');
var bcrypt = require('bcryptjs');

class movieControllers {
    post(req, res, next) {
        if (req.body.username.length <= 5) {
            res.render("view/login/Reg",
                {
                    error: {
                        username: `Username must be at least 5 characters long`
                    }
                })
            return
        }
        if (req.body.password.length <= 3) {
            res.render("view/login/Reg",
                {
                    error: {
                        password: `Password must be at least 4 characters long`
                    }
                })
            return
        }
        User.findOne({ username: req.body.username })
            .then((user) => {
                if (user) {
                    console.log(user);
                    res.render("view/login/Reg",
                        {
                            error: {
                                error: `This account already exists, please choose another account!`
                            }
                        })
                } else {

                    const formData = req.body
                    // mã hóa password
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(formData.password, salt);

                    formData.password = hash
                    // console.log(formData);
                    const Users = new User(formData)
                    Users.save()
                        .then(() =>
                            res.redirect('/login')
                            // res.json(formData)
                        )
                        .catch((error) => {
                            res.render("view/login/Reg",
                                {
                                    error: {
                                        error: `This account already exists, please choose another account!`
                                    }
                                })

                        })
                }
            })

        // await Tank.create({ size: 'small' });

        // res.send(`oke`)
        // res.json(req.body)

    }
    show(req, res) {
        res.render('view/login/Reg')
    }
}
module.exports = new movieControllers;
