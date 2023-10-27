
const { mutipleMongooseToObject, mongoosesToObject } = require('../../util/mongoose');
const Categories = require('../models/Categories');
const Orchid = require('../models/Orchid');
const Token = require('../../config/db/config');
var jwt = require("jsonwebtoken");
const User = require('../models/User');

class OrchidController {
    search(req, res, next) {
        function escapeRegExp(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        }
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
        const limit = parseInt(req.query.limit) || 10; // Số lượng phần tử trên mỗi trang, mặc định là 10
        const formData = req.query.name
        const escapedSearchTerm = escapeRegExp(formData);

        const options = {
            page: page,
            limit: 500000,

            // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
            collation: {
                locale: 'en',
            },
        };
        if (formData === "") {

            Orchid.find({})
                .then((Orchids) => {
                    res.redirect('/orchid')
                })
                .catch(next)
        } else {

            Orchid.paginate({ name: { $regex: escapedSearchTerm } }, options, function (err, result) {
                // result.docs
                // result.totalDocs = 100
                // result.limit = 10
                // result.page = 1
                // result.totalPages = 10
                // result.hasNextPage = true
                // result.nextPage = 2
                // result.hasPrevPage = false
                // result.prevPage = null
                // result.pagingCounter = 1
                if (result.totalPages < result.page) {
                    const options1 = {
                        page: result.totalPages,
                        limit: 5,

                        // tùy chọn xác định cách sắp xếp và so sánh trong truy vấn.
                        collation: {
                            locale: 'en',
                        },
                    };
                    Orchid.paginate({ name: { $regex: escapedSearchTerm } }, options1, function (err, data) {


                        return res.render('view/orchid',
                            {
                                Orchid: mutipleMongooseToObject(data.docs),
                                login: true,
                                totalPages: data.totalPages,
                                page: result.totalPages,
                                prevPage: data.prevPage,
                                nextPage: data.nextPage,
                                totalDocs: data.totalDocs,
                                search: formData
                            })

                    })

                } else {

                    return res.render('view/orchid',
                        {
                            Orchid: mutipleMongooseToObject(result.docs),
                            login: true,
                            totalPages: result.totalPages,
                            page: result.page,
                            prevPage: result.prevPage,
                            nextPage: result.nextPage,
                            totalDocs: result.totalDocs,
                            search: formData
                        })
                }
            });
        }


    }

    // comments(req, res, next) {
    //     try {
    //         const orchidId = req.params.id;
    //         const { rating, comment } = req.body;
    //         var checkTokenValid = jwt.verify(req.cookies.accessToken, Token.refreshToken);
    //         // Tạo một comment mới
    //         const newComment = {
    //             rating: rating,
    //             comment: comment,
    //             author: checkTokenValid.user._id,
    //         };

    //         // Tìm và cập nhật thông tin của orchid với id tương ứng
    //         Orchid.findById(orchidId)
    //             .then((data) => {
    //                 data.comments.push(newComment);
    //                 data.save();
    //             })
    //         res.redirect(`/orchid/${orchidId}`)
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // }
    comments(req, res, next) {
        try {
            const orchidId = req.params.id;
            const { rating, comment } = req.body;
            var checkTokenValid = jwt.verify(req.cookies.accessToken, Token.refreshToken);

            // Kiểm tra xem người dùng đã comment cho orchid này chưa
            Orchid.findOne({ _id: orchidId, 'comments.author': checkTokenValid.user._id })
                .then((existingComment) => {
                    if (existingComment) {
                        // Người dùng đã comment rồi, bạn có thể trả về thông báo lỗi hoặc cho phép chỉnh sửa comment hiện tại
                        User.find()
                            .then((User) => {
                                Categories.find()
                                    .then((categories) => {
                                        Orchid.findById(req.params.id)
                                            .then((Orchids) => {
                                                console.log(Orchids);
                                                return res.render('view/showOne',
                                                    {
                                                        Orchid: mongoosesToObject(Orchids),
                                                        login: true,
                                                        Categories: mutipleMongooseToObject(categories),
                                                        error: 'Bạn đã bình luận rồi',
                                                        User: mutipleMongooseToObject(User)
                                                    })
                                            })
                                    })
                            })
                    } else {
                        // Người dùng chưa comment, tạo một comment mới
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
                        res.redirect(`/orchid/${orchidId}`);
                    }
                });
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
