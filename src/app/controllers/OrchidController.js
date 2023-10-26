
const { mutipleMongooseToObject, mongoosesToObject } = require('../../util/mongoose');
const Categories = require('../models/Categories');
const Orchid = require('../models/Orchid');
const Token = require('../../config/db/config');
var jwt = require("jsonwebtoken");

class OrchidController {
    comments(req, res, next) {
        try {
            const orchidId = req.params.id;
            const { rating, comment } = req.body;
            var checkTokenValid = jwt.verify(req.cookies.accessToken, Token.refreshToken);
            // Tạo một comment mới
            const newComment = {
                rating: rating,
                comment: comment,
                author: checkTokenValid.user._id,
            };

            // Tìm và cập nhật thông tin của orchid với id tương ứng
            Orchid.findById(orchidId)
                .then((data) => {
                    data.comments.push(newComment);
                    data.save();
                })
            res.redirect(`/orchid/${orchidId}`)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
    put(req, res, next) {

        try {
            const { name } = req.body
            Orchid.findOne({ name: name })
                .then((players => {
                    if (players) {
                        if (players._id != req.params.id) {
                            Orchid.find({})
                                .then((players => {
                                    Categories.find()
                                        .then((categories) => {
                                            res.render('view/orchid',
                                                {
                                                    Orchid: mutipleMongooseToObject(players),
                                                    login: true,
                                                    errorPutName: `${name} name is already on the board`,
                                                    Categories: mutipleMongooseToObject(categories)
                                                })
                                        })

                                }
                                ))
                        } else {
                            Orchid.findByIdAndUpdate(req.params.id, req.body)
                                .then((Orchids => {
                                    res.redirect('/orchid')
                                }
                                ))
                                .catch(next)
                        }
                    } else {
                        Orchid.findByIdAndUpdate(req.params.id, req.body)
                            .then((player => {
                                res.redirect('/orchid')
                            }
                            ))
                            .catch(next)
                    }
                }
                ))
                .catch(next)

        } catch (err) {
            res.render('view/home')

        }
    }

    delete(req, res, next) {
        Orchid.findByIdAndDelete(req.params.id)
            .then((Orchids => {
                res.redirect('/orchid')
            }
            ))
            .catch(next)
    }

    show(req, res, next) {
        Categories.find()
            .then((categories) => {
                Orchid.find()
                    .then((Orchids) => {
                        console.log(Orchids);
                        return res.render('view/orchid',
                            {
                                Orchid: mutipleMongooseToObject(Orchids),
                                login: true,
                                Categories: mutipleMongooseToObject(categories)
                            })
                    })
            })


    }
    post(req, res, next) {
        const { name } = req.body
        console.log(1111111111, req.body);
        Categories.find()
            .then((categories) => {
                Orchid.findOne({ name: name })
                    .then((nations => {
                        if (nations) {
                            Orchid.find({})
                                .then((nations => {
                                    console.log(2222, nations[3]._id);
                                    res.render('view/orchid',
                                        {
                                            Orchid: mutipleMongooseToObject(nations),
                                            input: req.body,
                                            errorMessageName: `${name} name is already on the board`,
                                            login: true,
                                            Categories: mutipleMongooseToObject(categories)
                                        })
                                }
                                ))
                                .catch(next)
                        } else {
                            const nation = new Orchid(req.body);
                            nation.save()
                                .then(() => {
                                    res.redirect("/orchid");
                                })
                                .catch(next);
                        }
                    }
                    ))
                    .catch(next)

            })



    }

}
module.exports = new OrchidController;
