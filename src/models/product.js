const mongoose = require('mongoose');
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Product = new Schema(
    {
        id: { type: String, require: true, unique: true },
        name: { type: String, default: '' },
        price: { type: Number, default: 0 },
        priceSale: { type: Number, default: 0 },
        importPrice: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        sold: { type: Number, default: 0 },
        categories: { type: String, default: '' },
        supplier: { type: String, default: '' },
        images: { type: Array },
        imageCKs: { type: Array },
        status: { type: String, default: 'Còn hàng' },
        slug: { type: String, slug: 'name', unique: true },
        description: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', Product);
