const mongoose = require('mongoose');
const { getID } = require('../ult/string');
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const News = new Schema(
    {
        id: { type: String, default: getID(8) },
        title: String,
        image: String,
        imageCKs: Array,
        content: String,
        slug: { type: String, slug: 'title', unique: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('News', News);
