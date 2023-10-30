const mongoose = require('mongoose');
const MongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const commentSchema = new Schema({
    rating: { type: Number, min: 1, max: 5, require: true },
    comment: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", require: true, }
},
    { timestamps: true }
)
const orchidSchema = new Schema({
    name: { type: String, require: true ,unique: true,},
    image: { type: String, require: true },
    isNatural: { type: Boolean, default: false },
    origin: { type: String, require: true },
    comments: [commentSchema],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Categories", require: true },
}, { timestamps: true, });

commentSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: 'all' });
orchidSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('orchid', orchidSchema);

