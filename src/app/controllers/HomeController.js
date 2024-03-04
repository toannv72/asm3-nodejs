
const { mutipleMongooseToObject, mongoosesToObject } = require('../../util/mongoose');
const Token = require('../../config/db/config');
var jwt = require('jsonwebtoken');
const Orchid = require('../models/Orchid');
const Categories = require('../models/Categories');
const User = require('../models/User');
class homeControllers {
    index(req, res, next) {

        if (req.cookies.accessToken) {
            try {
                var checkTokenValid = jwt.verify(req?.cookies?.accessToken, Token.refreshToken);
                if (checkTokenValid?.user?.isAdmin) {
                    Orchid.find({})
                        .then((Orchids => {
                            res.render('view/home',
                                {
                                    Orchid: mutipleMongooseToObject(Orchids),
                                    login: true,
                                    admin: true,
                                })
                            // res.json(Orchids)
                        }
                        ))
                        .catch(next)
                } else {
                    Orchid.find({})
                        .then((Orchids => {
                            res.render('view/home',
                                {
                                    Orchid: mutipleMongooseToObject(Orchids),
                                    login: true,

                                })
                            // res.json(Orchids)
                        }
                        ))
                        .catch(next)
                }

            } catch (err) {
                Orchid.find({})
                    .then((Orchids => {
                        res.render('view/home',
                            {
                                Orchid: mutipleMongooseToObject(Orchids),
                            })
                    }
                    ))
                    .catch(next)

            }
        } else {
            Orchid.find({})
                .then((Orchids => {
                    res.render('view/home',
                        {
                            Orchid: mutipleMongooseToObject(Orchids),
                        })
                }
                ))
                .catch(next)
        }
    }

    getOne(req, res, next) {
        var checkTokenValid = jwt.verify(req?.cookies?.accessToken, Token.refreshToken);
        if (checkTokenValid?.user?.isAdmin) {
            User.find()
                .then((User) => {
                    Categories.find()
                        .then((categories) => {
                            if (req.cookies.accessToken) {
                                try {
                                    Orchid.findById(req.params.id)
                                        .then((Orchids => {
                                            if (Orchids) {

                                                res.render('view/showOne',
                                                    {
                                                        Orchid: mongoosesToObject(Orchids),
                                                        login: true,
                                                        Categories: mutipleMongooseToObject(categories),
                                                        User: mutipleMongooseToObject(User),
                                                        admin: true,
                                                    })
                                            } else {

                                                res.status(404).render('view/Error404',
                                                    {
                                                        login: true,
                                                    })

                                            }
                                        }
                                        ))
                                        .catch(next)
                                } catch (err) {
                                    Orchid.findById(req.params.id)
                                        .then((Orchids => {
                                            if (Orchids) {

                                                res.render('view/showOne',
                                                    {
                                                        Orchid: mongoosesToObject(Orchids),
                                                        login: true,
                                                        Categories: mutipleMongooseToObject(categories),
                                                        User: mutipleMongooseToObject(User),
                                                        admin: true,
                                                    })
                                            } else {

                                                res.status(404).render('view/Error404',
                                                    {
                                                        login: true,
                                                    })

                                            }
                                        }
                                        ))
                                        .catch(next)
                                }
                            } else {
                                Orchid.findById(req.params.id)
                                    .then((Orchids => {
                                        if (Orchids) {

                                            res.render('view/showOne',
                                                {
                                                    Orchid: mongoosesToObject(Orchids),
                                                    login: true,
                                                    Categories: mutipleMongooseToObject(categories),
                                                    User: mutipleMongooseToObject(User),
                                                    admin: true,
                                                })
                                        } else {

                                            res.status(404).render('view/Error404',
                                                {
                                                    login: true,
                                                })

                                        }
                                    }))
                                    .catch(next)
                            }
                        })
                })
        } else {
            User.find()
                .then((User) => {
                    Categories.find()
                        .then((categories) => {
                            if (req.cookies.accessToken) {
                                try {
                                    Orchid.findById(req.params.id)
                                        .then((Orchids => {
                                            if (Orchids) {

                                                res.render('view/showOne',
                                                    {
                                                        Orchid: mongoosesToObject(Orchids),
                                                        login: true,
                                                        Categories: mutipleMongooseToObject(categories),
                                                        User: mutipleMongooseToObject(User),

                                                    })
                                            } else {

                                                res.status(404).render('view/Error404',
                                                    {
                                                        login: true,
                                                    })

                                            }
                                        }
                                        ))
                                        .catch(next)
                                } catch (err) {
                                    Orchid.findById(req.params.id)
                                        .then((Orchids => {
                                            if (Orchids) {

                                                res.render('view/showOne',
                                                    {
                                                        Orchid: mongoosesToObject(Orchids),
                                                        login: true,
                                                        Categories: mutipleMongooseToObject(categories),
                                                        User: mutipleMongooseToObject(User),

                                                    })
                                            } else {

                                                res.status(404).render('view/Error404',
                                                    {
                                                        login: true,
                                                    })

                                            }
                                        }
                                        ))
                                        .catch(next)
                                }
                            } else {
                                Orchid.findById(req.params.id)
                                    .then((Orchids => {
                                        if (Orchids) {

                                            res.render('view/showOne',
                                                {
                                                    Orchid: mongoosesToObject(Orchids),
                                                    login: true,
                                                    Categories: mutipleMongooseToObject(categories),
                                                    User: mutipleMongooseToObject(User),

                                                })
                                        } else {

                                            res.status(404).render('view/Error404',
                                                {
                                                    login: true,
                                                })

                                        }
                                    }))
                                    .catch(next)
                            }
                        })
                })
        }

    }
}
module.exports = new homeControllers;
