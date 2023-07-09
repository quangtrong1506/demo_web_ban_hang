//? Tình trạng hàng
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemStatus = new Schema(
    {
        id: { type: ObjectId },
        name: { type: String, required: true },
        key: { type: String, slug: 'name', unique: true },
        description: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('itemStatus', itemStatus);
