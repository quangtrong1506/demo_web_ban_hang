const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Message = new Schema(
    {
        name: String,
        email: String,
        message: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', Message);
