const mongoose = require('mongoose');
const { getID } = require('../ult/string');

const Schema = mongoose.Schema;

const Admin = new Schema(
    {
        id: { type: String, default: getID(8) },
        name: { type: String },
        email: String,
        phone: String,
        password: String,
        avatar: { type: String, default: 'default.png' },
        role: String,
        birthday: String,
        luong: Number,
        cccd: String,
        chucvu: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Admin', Admin);
