//? Danh mục
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Categories = new Schema(
    {
        id: { type: ObjectId },
        name: { type: String, required: true },
        key: { type: String, slug: 'name', unique: true },
        description: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Categories', Categories);
