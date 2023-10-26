const path = require('path')
const handlebars = require('express-handlebars');
const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');
const app = express()
const cookieParser = require('cookie-parser')
const port = 5001
const db = require('./config/db')
const session = require('express-session');
const hbs = require('hbs');
const methodOverride = require('method-override')


app.use(cookieParser());
app.use(morgan('combined'))
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    // tạo công thức
    helpers: {
        sun: (a, b) => a + b,
        checkLogin: (login) => {
            if (login) {
                return (
                    ` hidden`
                )
            }
        },
        checkLogout: (login) => {
            if (!login) {
                return (
                    ` hidden`
                )

            }
        },
        check: (data) => {
            if (data === "true") {
                return (
                    `checked`
                )
            }
        },
        checkSelect: (a, b) => {
            if (a?.toString() === b?.toString()) {
                return (
                    ` selected`
                )
            }
        },
        checkChecked: (data) => {
            if (data) {
                return (
                    `checked`
                )
            }
        },
        checkCheckedNo: (data) => {
            if (!data) {

                return (
                    `checked`
                )
            }
        },
        checkAdmin: (login) => {
            if (login == true) {
                return (
                    ` hidden`
                )
            }
        },
        FunCategory: (a, b, c) => {
            if (a?.toString() === b?.toString()) {
                return  c  
            }
        },
        range: (from, to, block) => {
            var accum = '';
            for (var i = from; i <= to; ++i) {
                accum += block.fn(i);
            }
            return accum;
        },

        forPage: (totalPages, page, search) => {
            var ret = "";
            if (search) {
                for (var i = 1; i <= totalPages; i++) {
                    ret = ret + `<li class="page-item ${page === i ? `active" ` : '"'} >` +
                        `<${page === i ? `span " ` : 'a'} class="page-link " href="/table/search?page=${i}&name=${search}">${i}</${page === i ? `span " ` : 'a'}>`
                        + "</li>";
                }
            } else {

                for (var i = 1; i <= totalPages; i++) {
                    ret = ret + `<li class="page-item ${page === i ? `active" ` : '"'} >` +
                        `<${page === i ? `span " ` : 'a'} class="page-link " href="/table?page=${i}">${i}</${page === i ? `span " ` : 'a'}>`
                        + "</li>";
                }
            }
            return ret;
        },
        buttonPage: (page, search) => {
            if (search) {
                return `/table/search?page=${page}&name=${search}`
            }
            return `/table?page=${page}`
        },

        disabled: (a) => {
            if (a === null) {
                return 'disabled'
            }
            return ""
        }
    }
}));


app.use(methodOverride('_method'))

db.Connect()
app.use(session({
    secret: 'your-secret-key123', // Khóa bí mật để mã hóa session
    resave: true, //Mỗi req => tạo ra 1 session mới => không quan tâm ai hay browser nào hết
    saveUninitialized: true //Nếu không đụng hoặc chỉnh sửa thì mình không muốn session thay đổi
}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources'));

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

routes(app);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
