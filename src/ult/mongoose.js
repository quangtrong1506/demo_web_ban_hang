module.exports = {
    mongooseToObject: function (mongoose) {
        return mongoose.map((mongoose) => mongoose.toObject());
    },
    singleMongooseObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
};
