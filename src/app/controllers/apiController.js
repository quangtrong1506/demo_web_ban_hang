const { removeToneVietNamese, getD, getID } = require('../../ult/string');
const fs = require('fs-extra');
var appRoot = require('app-root-path');

const path = require('path');

const Product = require('../../models/product');
const Categories = require('../../models/categories');
const ItemStatus = require('../../models/itemStatus');
const Supplier = require('../../models/supplier');
const User = require('../../models/users');
const Cart = require('../../models/cart');
const Voucher = require('../../models/voucher');
const Message = require('../../models/message');
const Subscriber = require('../../models/subscriber');

const { mongooseToObject, singleMongooseObject } = require('../../ult/mongoose');

const nodemailer = require('nodemailer');
const myEmail = process.env.EMAIL;
const myPasswork = process.env.EMAIL_PASSWORD;
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: myEmail,
        pass: myPasswork,
    },
});

//  /api/:slug
function removeFile(path) {
    try {
        fs.unlinkSync(path);
    } catch (err) {
        console.error(err);
    }
}

class apiController {
    async getListItemStatus(req, res, next) {
        var list = await ItemStatus.find({});
        res.json(list);
    }
    async addItemStatus(req, res, next) {
        var name = req.query.name || req.body.name;
        var description = req.query.description || req.body.description;
        if (name) {
            var item = await ItemStatus.findOne({ name: name });
            if (item) return res.json({ code: 401, message: 'Trang thái này đã tồn tại' });
            else {
                const itemStatus = new ItemStatus({ name: name, description: description });
                itemStatus.save();
                return res.json({ message: 'Thêm trạng thái thành công' });
            }
        } else return res.json({ code: 401, message: 'Tên trạng thái không được để trống' });
    }
    async getListCategories(req, res, next) {
        var list = await Categories.find({});
        res.json(list);
    }
    async addCategories(req, res, next) {
        var name = req.query.name || req.body.name;
        var description = req.query.description || req.body.description;

        if (name) {
            var item = await Categories.findOne({ name: name });
            if (item) res.json({ code: 401, message: 'Danh mục này đã tồn tại' });
            else {
                const categories = new Categories({ name: name, description: description });
                categories.save();
                res.json({ message: 'Thêm danh mục thành công' });
            }
        } else res.json({ code: 401, message: 'Tên danh mục không được để trống' });
    }
    async editCategories(req, res, next) {
        var oldName = req.query.name || req.body.oldName,
            name = req.query.name || req.body.name,
            description = req.query.description || req.body.description;
        if (name) {
            var item = await Categories.findOne({ name: oldName });
            if (!item) return res.json({ code: 401, message: 'Danh mục không tại tồn tại' });
            else {
                const categories = await Categories.findOneAndUpdate(
                    { name: oldName },
                    {
                        name: name,
                        description: description,
                        key: removeToneVietNamese(name),
                    }
                );
                var prod = mongooseToObject(await Product.find({}));
                for (let i = 0; i < prod.length; i++) {
                    const element = prod[i];
                    if (element.categories == oldName) {
                        var p = await Product.findOneAndUpdate(
                            { categories: oldName },
                            { categories: name }
                        );
                        p.save();
                    }
                }
                categories.save();
                return res.json({ message: 'Sửa danh mục thành công' });
            }
        } else return res.json({ code: 401, message: 'Tên danh mục không được để trống' });
    }
    async removeCategories(req, res, next) {
        req.body.id;
        var x = await Categories.findOneAndRemove({ _id: req.body.id });
        if (x) res.json({ message: 'Xóa danh mục thành công' });
        else res.json({ code: 401, message: 'Không tìm thấy danh mục' });
    }
    async getListSupplier(req, res, next) {
        var list = await Supplier.find({});
        res.json(list);
    }

    async addSupplier(req, res, next) {
        var name = req.query.name || req.body.name,
            address = req.query.address || req.body.address,
            description = req.query.description || req.body.description;
        if (name) {
            var item = await Supplier.findOne({ name: name });
            if (item) return res.json({ code: 401, message: 'Nhà cung cấp này đã tồn tại' });
            else {
                const supplier = new Supplier({
                    name: name,
                    address: address,
                    description: description,
                });
                supplier.save();
                return res.json({ message: 'Thêm nhà cung cấp thành công' });
            }
        } else return res.json({ code: 401, message: 'Tên nhà cung cấp không được để trống' });
    }
    // post or get
    async editSupplier(req, res, next) {
        var oldName = req.query.name || req.body.oldName,
            name = req.query.name || req.body.name,
            address = req.query.address || req.body.address,
            description = req.query.description || req.body.description;
        if (name) {
            var item = await Supplier.findOne({ name: oldName });
            if (!item) return res.json({ code: 401, message: 'Nhà cung cấp không tồn tại' });
            else {
                const supplier = await Supplier.findOneAndUpdate(
                    { name: oldName },
                    {
                        name: name,
                        address: address,
                        description: description,
                    }
                );
                var prod = mongooseToObject(await Product.find({}));
                for (let i = 0; i < prod.length; i++) {
                    const element = prod[i];
                    if (element.supplier == oldName) {
                        var p = await Product.findOneAndUpdate(
                            { supplier: oldName },
                            { supplier: name }
                        );
                        p.save();
                    }
                }
                supplier.save();
                return res.json({ message: 'Sửa nhà cung cấp thành công' });
            }
        } else return res.json({ code: 401, message: 'Tên nhà cung cấp không được để trống' });
    }

    async removeSupplier(req, res, next) {
        req.body.id;
        var x = await Supplier.findOneAndRemove({ _id: req.body.id });
        if (x) res.json({ message: 'Xóa nhà cung cấp thành công' });
        else res.json({ code: 401, message: 'Không tìm thấy nhà cung cấp' });
    }

    async fileUploadTemp(req, res, next) {
        console.log('fileUploadTemp');
        res.status(200);
    }
    //? post method
    async addProduct(req, res, next) {
        var id = req.body.id,
            name = req.body.name,
            quantity = req.body.quantity,
            status = req.body.status,
            categories = req.body.categories,
            price = req.body.price,
            importPrice = req.body.importPrice,
            supplier = req.body.supplier,
            description = req.body.description,
            priceSale = req.body.priceSale;
        var images = [];
        var imageCKs = [];
        if (req.files) {
            Array.isArray(req.files.images)
                ? (images = req.files.images)
                : !req.files.images
                ? (imageCKs = [])
                : images.push(req.files.images);

            Array.isArray(req.files.imageCKs)
                ? (imageCKs = req.files.imageCKs)
                : !req.files.imageCKs
                ? (imageCKs = [])
                : imageCKs.push(req.files.imageCKs);
        }
        var prod = await Product.findOne({ id: id });
        if (prod) return res.json({ code: 401, message: 'ID đã tồn tại không thể thêm' });

        var message = 'Thêm sản phẩm thành công',
            code = 401;
        if (!id) id = getID(8);
        if (!name) message = 'Tên sản phẩm đang bị để trống';
        else if (!quantity) message = 'Chưa nhập số lượng sản phẩm';
        else if (!status || status == -1) message = 'Vui lòng chọn trạng thái của sản phẩm';
        else if (!categories || categories == -1) message = 'Vui lòng chọn danh mục của sản phẩm';
        else if (!price) message = 'Vui lòng nhập giá của sản phẩm';
        else if (!importPrice) message = 'Vui lòng nhập giá nhập hàng của sản phẩm';
        else if (!supplier || supplier == -1)
            message = 'Vui lòng chọn nhà cung cấp hàng của sản phẩm';
        else if (images.length == 0) message = 'Vui lòng chọn ít nhất 1 hình ảnh cho sản phẩm';
        else {
            // lưu ảnh
            var files = images.concat(imageCKs);
            var urlImages = [];
            var urlImageCKs = [];
            for (let i = 0; i < files.length; i++) {
                const element = files[i];
                let uploadPath;
                var a = element.name.split('.');
                var b = element.mimetype.split('/');
                var iName = a[1] ? a[1] : b[1];
                var newFile =
                    removeToneVietNamese(name.replace(/ /g, '-')) +
                    '_' +
                    getD() +
                    '_' +
                    getID(12) +
                    '.' +
                    iName;
                var newPath = path
                    .dirname(__dirname)
                    .replace('src\\app', 'public\\images\\product\\');
                uploadPath = newPath + newFile;
                i < images.length ? urlImages.push(newFile) : urlImageCKs.push(newFile);
                if (iName != 'plain') {
                    element.mv(uploadPath, function (err) {
                        if (err) {
                            console.log('Không thể lưu file:' + newFile);
                        }
                    });
                }
            }
            var count = 0;
            description = description.replace(/img/g, function () {
                var a = urlImageCKs[count].split('.');
                if (a[1] != 'plain')
                    return `img src="/images/product/${urlImageCKs[count]}" alt="${
                        urlImageCKs[count++]
                    }"`;
                else return `img `;
            });
            code = 1;
            //? Tạo sản phẩm trong cơ sở dữ liệu mới
            var product = new Product({
                id: id,
                name: name,
                quantity: quantity,
                status: status,
                categories: categories,
                price: price,
                importPrice: importPrice,
                supplier: supplier,
                description: description,
                images: urlImages,
                imageCKs: urlImageCKs,
                priceSale: priceSale,
            });
            product.save();
        }
        res.json({ code: code, message: message });
    }
    //? Post
    async editProduct(req, res, next) {
        var id = req.body.id,
            name = req.body.name,
            quantity = req.body.quantity,
            status = req.body.status,
            categories = req.body.categories,
            price = req.body.price,
            importPrice = req.body.importPrice,
            supplier = req.body.supplier,
            description = req.body.description,
            priceSale = req.body.priceSale;

        var images = [];
        var imageCKs = [];
        if (req.files) {
            Array.isArray(req.files.images)
                ? (images = req.files.images)
                : !req.files.images
                ? (imageCKs = [])
                : images.push(req.files.images);

            Array.isArray(req.files.imageCKs)
                ? (imageCKs = req.files.imageCKs)
                : !req.files.imageCKs
                ? (imageCKs = [])
                : imageCKs.push(req.files.imageCKs);
        }
        var prod = await Product.findOne({ id: id });
        if (!prod) return res.json({ code: 401, message: 'ID không tồn tại' });

        var message = 'Sửa thông tin sản phẩm thành công',
            statusMessage = 401;
        if (!name) message = 'Tên sản phẩm đang bị để trống';
        else if (!quantity) message = 'Chưa nhập số lượng sản phẩm';
        else if (!status || status == -1) message = 'Vui lòng chọn trạng thái của sản phẩm';
        else if (!categories || categories == -1) message = 'Vui lòng chọn danh mục của sản phẩm';
        else if (!price) message = 'Vui lòng nhập giá của sản phẩm';
        else if (!importPrice) message = 'Vui lòng nhập giá nhập hàng của sản phẩm';
        else if (!supplier || supplier == -1)
            message = 'Vui lòng chọn nhà cung cấp hàng của sản phẩm';
        else if (images.length == 0) message = 'Vui lòng chọn ít nhất 1 hình ảnh cho sản phẩm';
        else {
            var files = images.concat(imageCKs);
            var urlImages = [];
            var urlImageCKs = [];
            for (let i = 0; i < files.length; i++) {
                const element = files[i];
                let uploadPath;
                var a = element.name.split('.');
                var b = element.mimetype.split('/');
                var iName = a[1] ? a[1] : b[1];
                var newFile =
                    removeToneVietNamese(name.replace(/ /g, '-')) +
                    '_' +
                    getD() +
                    '_' +
                    getID(12) +
                    '.' +
                    iName;
                var newPath = path
                    .dirname(__dirname)
                    .replace('src\\app', 'public\\images\\product\\');
                uploadPath = newPath + newFile;
                i < images.length ? urlImages.push(newFile) : urlImageCKs.push(newFile);
                if (iName != 'plain') {
                    element.mv(uploadPath, function (err) {
                        if (err) {
                            console.log('Không thể lưu file:' + newFile);
                        }
                    });
                }
            }
            // xóa file cũ
            var fileOld = prod.images.concat(prod.imageCKs);
            for (let i = 0; i < fileOld.length; i++) {
                const element = fileOld[i];
                removeFile('public\\images\\product\\' + element);
            }
            var count = 0;
            description = description.replace(/img/g, function () {
                var a = urlImageCKs[count].split('.');
                if (a[1] != 'plain')
                    return `img src="/images/product/${urlImageCKs[count]}" alt="${
                        urlImageCKs[count++]
                    }"`;
                else return `img `;
            });
            statusMessage = 1;
            //? Tạo sản phẩm trong cơ sở dữ liệu mới
            var product = await Product.findOneAndUpdate(
                { id: id },
                {
                    id: id,
                    name: name,
                    quantity: quantity,
                    status: status,
                    categories: categories,
                    price: price,
                    importPrice: importPrice,
                    supplier: supplier,
                    description: description,
                    images: urlImages,
                    imageCKs: urlImageCKs,
                    priceSale: priceSale,
                }
            );
            product.save();
        }

        return res.json({ code: statusMessage, message: message });
    }
    // ? post
    async removeProduct(req, res, next) {
        var x = await Product.findOneAndDelete({ id: req.body.id });
        var fileOld = x.images.concat(x.imageCKs);
        for (let i = 0; i < fileOld.length; i++) {
            const element = fileOld[i];
            removeFile('public\\images\\product\\' + element);
        }
        if (x) res.json({ message: 'Đã xóa thành công' });
        else res.json({ code: 401, message: 'Không tìm thấy sản phẩm' });
    }
    // Giỏ hàng
    async addToCart(req, res, next) {
        var productId = req.body.productId,
            quantity = req.body.quantity;
        if (!req.session.userInfo)
            return res.json({ code: 401, message: 'Vui lòng đăng nhập để thêm vào giỏ hàng' });
        if (!productId) return res.json({ code: 401, message: 'ID sản phẩm trống' });
        if (quantity < 1)
            return res.json({
                code: 401,
                message: 'Sản phẩm phải lớn hơn 0',
            });
        var product = await Product.findOne({ id: productId });
        if (!product) return res.json({ code: 401, message: 'Không tìm thấy sản phẩm' });
        if (product.status == 'Ngừng kinh doanh')
            return res.json({
                code: 401,
                message: 'Cửa hàng đã ngừng kinh doanh sản phẩm này',
            });
        if (product.quantity == 0)
            return res.json({
                code: 401,
                message: 'Sản phẩm này đã hết hàng',
            });
        var cartDB = await Cart.findOne({ productId: productId, userId: req.session.userInfo.id });
        var cart = null;
        if (!cartDB) {
            if (quantity > product.quantity)
                return res.json({
                    code: 401,
                    message: 'Bạn đã thêm quá số lượng hàng mà shop có',
                });
            cart = new Cart({
                userId: req.session.userInfo.id,
                productId: productId,
                quantity: quantity,
            });
        } else {
            {
                if (cartDB.quantity + quantity > product.quantity)
                    return res.json({
                        code: 401,
                        message: 'Bạn đã thêm quá số lượng hàng mà shop có',
                    });

                cart = await Cart.findOneAndUpdate(
                    { productId: productId, userId: req.session.userInfo.id },
                    { quantity: cartDB.quantity + quantity }
                );
            }
        }
        cart.save();
        return res.json({ message: 'Thêm vào giỏ hàng thành công thành công' });
    }
    async cartInfo(req, res, next) {
        if (!req.session.login) return res.json({ code: 401, message: 'Vui lòng đang nhập' });
        var cartDB = await Cart.find({ userId: req.session.userInfo.id });
        cartDB = mongooseToObject(cartDB);
        var sum = 0,
            count = 0;
        var canCheckOut = true;
        for (let i = 0; i < cartDB.length; i++) {
            var prod = await Product.findOne({ id: cartDB[i].productId });
            if (!prod) {
                canCheckOut = false;
                count += 1;
                continue;
            }
            if (prod.status == 'Ngừng kinh doanh') {
                canCheckOut = false;
                count += 1;
                continue;
            }
            sum += (prod.price - prod.priceSale) * cartDB[i].quantity;
            count += cartDB[i].quantity;
        }
        var sumText = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(sum);
        res.json({ count: count, cart: cartDB, sum: sum, sumText: sumText, canCheckOut });
    }
    async updateCart(req, res, next) {
        var productId = req.body.productId,
            quantity = req.body.quantity;
        if (!req.session.userInfo)
            return res.json({ code: 401, message: 'Vui lòng đăng nhập lại để thêm vào giỏ hàng' });
        if (!productId) return res.json({ code: 401, message: 'ID sản phẩm trống' });
        if (quantity < 1)
            return res.json({
                code: 401,
                message: 'Sản phẩm phải lớn hơn 0',
            });
        var product = await Product.findOne({ id: productId });
        if (!product) return res.json({ code: 401, message: 'Không tìm thấy sản phẩm' });
        var cartDB = await Cart.findOne({ productId: productId, userId: req.session.userInfo.id });
        if (!cartDB)
            return res.json({ code: 401, message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        else {
            if (quantity > product.quantity)
                return res.json({
                    code: 401,
                    message: 'Bạn đã thêm quá số lượng hàng mà shop có',
                    cart: cartDB,
                });
            var cart = await Cart.findOneAndUpdate(
                { productId: productId, userId: req.session.userInfo.id },
                { quantity: quantity }
            );
            cart.save();
            var cart = await Cart.findOne({
                productId: productId,
                userId: req.session.userInfo.id,
            });
            cart = singleMongooseObject(cart);
            cart.sum = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(cart.quantity * (product.price - product.priceSale));
            return res.json({ message: 'Cập nhật giỏ hàng thành công thành công', cart: cart });
        }
    }
    async removeCart(req, res, next) {
        var productId = req.body.productId;
        if (!req.session.userInfo)
            return res.json({
                code: 401,
                message: 'Vui lòng đăng nhập để xóa sản phẩm trong giỏ hàng',
            });
        if (!productId) return res.json({ code: 401, message: 'ID sản phẩm trống' });
        // var product = await Product.findOne({ id: productId });
        // if (!product) return res.json({ code: 401, message: 'Không tìm thấy sản phẩm' });
        var cartDB = await Cart.findOne({ productId: productId, userId: req.session.userInfo.id });
        if (!cartDB)
            return res.json({
                code: 401,
                message: 'Không tìm thấy sản phẩm phù hợp trong giỏ hàng',
            });
        else
            await Cart.findOneAndRemove({
                productId: productId,
                userId: req.session.userInfo.id,
            });
        return res.json({ message: 'Xóa sản phẩm giỏ hàng thành công' });
    }
    // Mã giảm giá
    async addVoucher(req, res, next) {
        var code = req.body.code,
            price = req.body.price,
            quantity = req.body.quantity,
            type = req.body.type,
            startTime = req.body.startTime,
            endTime = req.body.endTime;
        var voucher = new Voucher({
            code: code,
            price: price,
            quantity: quantity,
            type: type,
            start: startTime,
            end: endTime,
        });
        voucher.save();
        res.json({ message: 'Thêm mã khuyến mãi thành công' });
    }
    async checkVoucher(req, res, next) {
        var code = req.body.code;
        var voucher = await Voucher.findOne({ code: code });
        if (!voucher) return res.json({ code: 401, message: 'Mã giảm giá không hợp lệ' });
        voucher = singleMongooseObject(voucher);
        if (voucher.quantity == 0)
            return res.json({
                code: 401,
                message: 'Mã giảm giá đã hết lượt sử dụng',
            });
        if (voucher.type == 'private' && req.session.userInfo.id != voucher.userId)
            return res.json({
                code: 401,
                message: 'Mã giảm giá không áp dụng với tài khoản của bạn',
            });
        var check = null;
        voucher.userUsed.forEach((element) => {
            if (req.session.login)
                if (voucher.type == 'public' && req.session.userInfo.id === element) check = true;
        });
        if (check)
            return res.json({
                code: 401,
                message: 'Bạn đã từng sử dụng mã giảm giá này rồi',
            });
        var startTime = new Date(voucher.start.replace(/-/g, '/'));
        var endTime = new Date(voucher.end.replace(/-/g, '/'));
        var now = new Date();
        if (startTime > now)
            return res.json({
                code: 401,
                message: 'Voucher này chưa khả dụng',
            });
        if (endTime < now)
            return res.json({
                code: 401,
                message: 'Voucher này đã hết hạn ',
            });
        res.json({
            message: 'Đã áp dụng mã khuyến mại',
            price: voucher.price,
        });
    }
    // Cần liên hệ
    async addMessage(req, res, next) {
        var name = req.body.name,
            email = req.body.email,
            message = req.body.message;
        if (!name) return res.json({ code: 401, message: 'Vui lòng nhập họ & tên' });
        if (!email) return res.json({ code: 401, message: 'Vui lòng nhập Email' });
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g))
            return res.json({ code: 401, message: 'Địa chỉ email không hợp lệ' });
        if (!message)
            return res.json({ code: 401, message: 'Vui lòng để lại lời nhắn với cửa hàng' });

        var newMessage = new Message({
            name: name,
            email: email,
            message: message,
        });
        newMessage.save();
        var mailOptions = {
            from: myEmail,
            to: email,
            subject: 'Cảm ơn bạn đã để lại lơi nhắn đến shop - Yêu Công Nghệ',
            html: `Chúng tôi sẽ liên hệ với bạn sớm nhất<br>
            <br>
            <hr>
            Công ty: yêu công nghệ<br>
            Website: <a href="#">yeucongnghe.com</a><br>
            Phone: (+84) 389 619 050<br>
            Email: ${myEmail}
            `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.json({ message: 'Cửa hàng sẽ liên hệ lại với bạn sau' });
    }
    // Đăng ký nhận ưu đãi
    async addSubscriber(req, res, next) {
        var email = req.body.email;
        if (!email) return res.json({ code: 401, message: 'Vui lòng nhập Email' });
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g))
            return res.json({ code: 401, message: 'Địa chỉ Email không hợp lệ' });
        var newSubscriber = new Subscriber({
            email: email,
        });
        newSubscriber.save();
        var mailOptions = {
            from: myEmail,
            to: email,
            subject:
                'Bạn đã đăng ký thành công nhận các thông tin ưu đã từ cửa hàng - Yêu Công Nghệ',
            html: `Mỗi khi chúng tôi có thông tin ưu đã sẽ gửi Email cho bạn
            <br>
            Cảm ở bạn đã quan tâm đến cửa hàng
            <br>
            <br>
            <hr>
            Công ty: yêu công nghệ<br>
            Website: <a href="#">yeucongnghe.com</a><br>
            Phone: (+84) 389 619 050<br>
            Email: ${myEmail}
            `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.json({ message: 'Bạn đã đăng ký thành công' });
    }
    error(req, res, next) {
        res.json({
            code: 404,
            message: 'API không tồn tại',
            key: 'abc',
            path: appRoot,
        });
    }
}

module.exports = new apiController();
