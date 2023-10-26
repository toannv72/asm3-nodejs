
const { mutipleMongooseToObject, mongoosesToObject } = require('../../util/mongoose');
const Categories = require('../models/Categories');
const Orchid = require('../models/Orchid');
class CategoryController {

    put(req, res, next) {
        try {
            const { categoryName } = req.body
            Categories.findOne({ categoryName: categoryName })
                .then((players => {
                    if (players) {
                        if (players._id != req.params.id) {
                            Categories.find({})
                                .then((players => {
                                    res.render('view/categories',
                                        {
                                            Categories: mutipleMongooseToObject(players),
                                            login: true,
                                            errorPutName: `${categoryName} name is already on the board`,
                                        })
                                }
                                ))
                        } else {
                            Categories.findByIdAndUpdate(req.params.id, req.body)
                                .then((Categories => {
                                    res.redirect('/category')
                                }
                                ))
                                .catch(next)
                        }
                    } else {
                        Categories.findByIdAndUpdate(req.params.id, req.body)
                            .then((player => {
                                res.redirect('/category')
                            }
                            ))
                            .catch(next)
                    }
                }
                ))
                .catch(next)

        } catch (err) {
            res.redirect('/category')
        }
    }

    delete(req, res, next) {
        Orchid.findOne({ category: req.params.id })
            .then((Orchid) => {
                if (Orchid) {
                    Categories.find()
                        .then((Categories) => {
                            return res.render('view/categories',
                                {
                                    Categories: mutipleMongooseToObject(Categories),
                                    input: req.body,
                                    errorPutName: `không thể xóa vì đã có cây lan có trường này`,
                                    login: true,
                                })
                        })
                } else {
                    Categories.findByIdAndDelete(req.params.id)
                        .then((Categories => {
                            res.redirect('/category')
                        }
                        ))
                        .catch(next)
                }
            });
    }

    show(req, res, next) {

        Categories.find()
            .then((Categories) => {
                return res.render('view/categories',
                    {
                        Categories: mutipleMongooseToObject(Categories),
                        login: true,
                    })
            })

    }
    post(req, res, next) {
        const { categoryName } = req.body
        Categories.findOne({ categoryName: categoryName })
            .then((nations => {
                if (nations) {
                    Categories.find({})
                        .then((nations => {
                            res.render('view/categories',
                                {
                                    Categories: mutipleMongooseToObject(nations),
                                    input: req.body,
                                    errorMessage: `${categoryName} Name is already on the board`,
                                    login: true,
                                })
                        }
                        ))
                        .catch(next)
                    // res.redirect("back");
                } else {
                    const nation = new Categories(req.body);
                    nation.save()
                        .then(() => {
                            res.redirect("/category");
                        })
                        .catch(next);
                }
            }
            ))
            .catch(next)

        // const formData = req.body
        // const course = new Categories(formData)
        // course.save()
        //     .then(() => res.redirect('/category'))
        //     .catch((error) => {
        //         res.json(req.body)

        //         // res.render(`view/Categories/createCategories`)
        //     })
        // res.send(`oke`)


    }

}
module.exports = new CategoryController;
