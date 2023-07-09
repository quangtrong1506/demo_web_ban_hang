const mongoose = require('mongoose');
const { getID } = require('../ult/string');

const Schema = mongoose.Schema;

const Order = new Schema(
    {
        id: { type: String, default: getID(8) },
        userId: { type: String },
        products: { type: Array, default: [] },
        userName: { type: String },
        tp: String,
        qh: String,
        xp: String,
        address: { type: String },
        phone: { type: String },
        email: { type: String },
        total: { type: Number, default: 0 },
        ship: { type: Number, default: 30000 },
        sum: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        note: { type: String },
        status: { type: String },
        liDoHuyHang: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', Order);
