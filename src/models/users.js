const mongoose = require('mongoose');
const { getID } = require('../ult/string');

const Schema = mongoose.Schema;

const User = new Schema(
    {
        id: { type: String, default: getID(8) },
        name: { type: String },
        email: String,
        phone: String,
        address: String,
        password: String,
        avatar: { type: String, default: 'default.png' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', User);
