
const { mutipleMongooseToObject, mongoosesToObject } = require('../../util/mongoose');
class logoutControllers {
    
    post(req, res) {
        res.clearCookie("accessToken");
        res.redirect('/login')
    }
}
module.exports = new logoutControllers;
