const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Cart = new Schema(
    {
        userId: { type: String, require },
        productId: { type: String, require },
        quantity: { type: Number, require },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', Cart);
