const { singleMongooseObject, mongooseToObject } = require('../../ult/mongoose');
const { saveSingleImage } = require('../../ult/saveFile');
const { removeToneVietNamese, getD, getID } = require('../../ult/string');

const path = require('path');
const Supplier = require('../../models/supplier');
const ItemStatus = require('../../models/itemStatus');
const Categories = require('../../models/categories');

// [GET]: /category/:slug
class uploadController {
    index(req, res, next) {
        res.render('admin/index', {
            layout: 'admin',
        });
    }
    async uploadImage(req, res, next) {
        let uploadPath;
        var file = req.files.upload;
        var a = file.name.split('.');
        var newFile =
            removeToneVietNamese(a[0]) + '_photo_' + getD() + '_' + getID(12) + '.' + a[1];
        var newPath = path.dirname(__dirname).replace('src\\app', 'public\\images\\image_upload\\');
        uploadPath = newPath + newFile;
        await file.mv(uploadPath, async function (err) {
            let x;
            if (err) {
                x = {
                    status: -1,
                    message: err.message,
                };
            } else {
                x = {
                    status: 1,
                    message: 'Lưu ảnh thành công',
                    link: 'images/image_upload/' + newFile,
                };
            }
            console.log(x);
        });
        res.status(200);
    }
}

module.exports = new uploadController();
