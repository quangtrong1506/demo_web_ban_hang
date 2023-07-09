const mongoose = require('mongoose');
const { getID } = require('../ult/string');

const Schema = mongoose.Schema;

const Comment = new Schema(
    {
        id: { type: String, default: getID(8) },
        userId: { type: String },
        startTime: { Type: String },
        productId: { type: String },
        comment: { type: String, default: '' },
        star: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', Comment);
