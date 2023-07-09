//? Nhà cung cấp
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Supplier = new Schema(
    {
        id: { type: ObjectId },
        name: { type: String },
        address: { type: String, default: '' },
        description: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Supplier', Supplier);
