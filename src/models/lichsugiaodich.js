const mongoose = require('mongoose');
const { getID } = require('../ult/string');

const Schema = mongoose.Schema;

const LichSuGiaoDich = new Schema(
    {
        id: { type: String, default: getID(8) },
        name: { type: String },
        money: String,
        type: String,
        note: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('LichSuGiaoDich', LichSuGiaoDich);
