const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload());

module.exports = {
    saveSingleImage: function (file) {
        let uploadPath;
        var a = file.name.split('.');
        var newFile = 'photo_' + getDay() + '_' + getID(12) + '.' + a[1];
        var newPath = path.dirname(__dirname).replace('src\\app', 'public\\images\\image_upload\\');
        uploadPath = newPath + newFile;
        file.mv(uploadPath, async function (err) {
            if (err) {
                return {
                    status: -1,
                    message: err.message,
                };
            } else {
                return {
                    status: 1,
                    message: 'Lưu ảnh thành công',
                    link: 'images/image_upload/' + newFile,
                };
            }
        });
    },
};
function getID(length) {
    length = length || 12;
    length = length < 12 ? 12 : length > 30 ? 30 : length;
    var char = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var a = char.split();
    var id = '';
    while (id.length < length) {
        id += a[Math.floor(Math.random() * char.length)];
    }
    return id;
}
function getDay() {
    var date = new Date();
    var fullYear = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    var d = fullYear + month + day;
    return d;
}
