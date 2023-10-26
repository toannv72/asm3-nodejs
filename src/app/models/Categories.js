const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator')
const Schema = mongoose.Schema;
mongoose.plugin(slug)
const CategorySchema = new Schema({
    categoryName: { type: String, unique: true,require: true  }
},
    { timestamps: true, }
);


module.exports = mongoose.model('Categories', CategorySchema);

