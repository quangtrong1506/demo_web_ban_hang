const mongoose = require('mongoose');
const { getID } = require('../ult/string');

const Schema = mongoose.Schema;

const Voucher = new Schema(
    {
        code: { type: String, default: getID(8) },
        quantity: { type: Number, default: 1 },
        startTime: { Type: String },
        endTime: { type: String },
        price: { type: Number, default: 0 },
        type: { type: String, default: 'public' },
        userId: { type: String, default: '' },
        userUsed: { type: Array, default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Voucher', Voucher);
