const Product = require('../../models/product');
const Categories = require('../../models/categories');
const ItemStatus = require('../../models/itemStatus');
const Supplier = require('../../models/supplier');
const User = require('../../models/users');
const Cart = require('../../models/cart');
const Voucher = require('../../models/voucher');
const Order = require('../../models/order');
const LichSuGiaoDich = require('../../models/lichsugiaodich');
const Comment = require('../../models/comment');

const bcrypt = require('bcrypt');

const fs = require('fs-extra');
const path = require('path');

const { mongooseToObject, singleMongooseObject } = require('../../ult/mongoose');

const { getID, removeToneVietNamese } = require('../../ult/string');
var salt = bcrypt.genSaltSync(10);

// Mail
const nodemailer = require('nodemailer');
const myEmail = 'sp.yeucongnghe@gmail.com';
const myPasswork = 'hjgrkdpeplraiuoa';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: myEmail,
        pass: myPasswork,
    },
});

function removeFile(path) {
    try {
        fs.unlinkSync(path);
    } catch (err) {
        console.error(err);
    }
}

class HomeController {
    // post
    async register(req, res, next) {
        var user = req.body;
        var email = user.username || '',
            password = user.password || '',
            confirmPassword = user.confirm || '',
            phone = user.phone || '',
            name = user.name || '';
        var message = 'Đăng ký tài khoản thành công';
        if (!email)
            return res.json({
                code: 401,
                message: 'Vui lòng nhập Email',
            });
        if (!name)
            return res.json({
                code: 401,
                message: 'Vui lòng nhập họ & tên của bạn',
            });
        if (!phone)
            return res.json({
                code: 401,
                message: 'Vui lòng nhập số điện thoại của bạn',
            });
        else if (!password)
            return res.json({
                code: 401,
                message: 'Vui lòng nhập mật khẩu',
            });
        else if (password != confirmPassword)
            return res.json({
                code: 401,
                message: 'Xác nhận mật khẩu không chính xác',
            });
        else if (email.match('@') && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            return res.json({
                code: 401,
                message: 'Địa chỉ email không hợp lệ',
            });
        } else if (phone.match(/[^0-9]/g)) {
            return res.json({
                code: 401,
                message: 'Số điện thoại không hợp lệ',
            });
        } else {
            var user = await User.findOne({ phone: phone });
            if (user)
                return res.json({
                    code: 401,
                    message: 'Số điện thoại đã được đăng ký',
                });
            user = await User.findOne({ email: email });
            if (user)
                return res.json({
                    code: 401,
                    message: 'Email này đã được đăng ký',
                });
            var newUser = new User({
                name: name,
                password: bcrypt.hashSync(password, salt),
                email: email,
                phone: phone,
            });
            newUser.save();
        }
        res.json({
            code: 200,
            message: message,
        });
    }
    async login(req, res, next) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        var user = req.body;
        var userP = await User.findOne({ phone: user.username });
        if (!userP) userP = await User.findOne({ email: user.username });
        if (!userP)
            return res.json({ code: 401, message: 'Số điện thoại hoặc email chưa được đăng ký' });
        var kq = bcrypt.compareSync(user.password, userP.password);
        if (!kq) return res.json({ code: 401, message: 'Mật khẩu không chính xác' });
        //
        var session = req.session;
        session.login = true;
        session.userInfo = userP;
        console.log(userP);
        res.json({ code: 1, message: 'Đăng nhập thành công' });
    }
    async forgotPassword(req, res, next) {
        var email = req.body.email;
        var userDB = await User.findOne({ email: email });
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g))
            return res.json({ code: 401, message: 'Địa chỉ email không hợp lệ' });
        if (!userDB) return res.json({ code: 401, message: 'Địa chỉ Email này chưa được đăng ký' });
        var newPassword = getID(8);
        var password = bcrypt.hashSync(newPassword, salt);
        await User.findOneAndUpdate(
            { email: email },
            {
                password: password,
            }
        );
        var mailOptions = {
            from: myEmail,
            to: email,
            subject: 'Lấy lại mật khẩu - Yêu Công Nghệ',
            html: `Mật khẩu mới của bạn là: <b>${newPassword}</b> 
                <br>Vui lòng đổi mật khẩu khi đăng nhập lại
                <br>
                <hr>
                Nếu bạn không thực hiện hành động này vui lòng bỏ qua tin nhắn
                <br>
                <a href="#">Yeucongnghe.vn</a>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.json({
            message: 'Mật khẩu đã được chuyển về email của bạn',
        });
    }
    async logout(req, res, next) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        var session = req.session;
        session.destroy();
        // session.login = false;
        // session.userInfo = {};
        res.redirect('/');
    }
    async info(req, res, next) {
        var categories = await Categories.find({});
        res.render('user/info', {
            layout: 'main',
            title: 'Thông tin cá nhân',
            session: req.session,
            categories: mongooseToObject(categories),
        });
    }
    // post
    async changeInfo(req, res, next) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (!req.session.login) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var name = req.body.name,
            phone = req.body.phone,
            email = req.body.email,
            address = req.body.address;
        if (!name) return res.json({ code: 401, message: 'Vui lòng nhập tên' });
        if (!email) return res.json({ code: 401, message: 'Vui lòng nhập địa chỉ Email' });
        if (!phone) return res.json({ code: 401, message: 'Vui lòng nhập số điện thoại' });
        if (!address) return res.json({ code: 401, message: 'Vui lòng nhập địa chỉ' });
        if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/im))
            return res.json({ code: 401, message: 'Số điện thoại không hợp lệ' });
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/im))
            return res.json({ code: 401, message: 'Email không hợp lệ' });
        var userDB = await User.findOne({ id: req.session.userInfo.id });
        if (phone != userDB.phone) {
            var userTmp = await User.findOne({ phone: phone });
            if (userTmp)
                return res.json({ code: 401, message: 'Số điện thoại đã được đăng ký sử dụng' });
        }
        if (email != userDB.email) {
            var userTmp = await User.findOne({ email: email });
            if (userTmp) return res.json({ code: 401, message: 'Email đã được đăng ký sử dụng' });
        }
        let uploadPath;
        var a = req.files.avatar.name.split('.');
        var b = req.files.avatar.mimetype.split('/');
        var iName = a[1] ? a[1] : b[1];
        var newFile = removeToneVietNamese(name.replace(/ /g, '-')) + '_' + getID(12) + '.' + iName;
        var newPath = path.dirname(__dirname).replace('src\\app', 'public\\images\\user\\');
        uploadPath = newPath + newFile;
        if (iName != 'plain') {
            req.files.avatar.mv(uploadPath, function (err) {
                if (err) {
                    console.log('Không thể lưu file:' + newFile);
                }
            });
        }
        if (req.session.userInfo.avatar != 'default.png')
            removeFile('public\\images\\user\\' + req.files.avatar);

        var user = await User.findOneAndUpdate(
            { id: req.session.userInfo.id },
            {
                name: name,
                phone: phone,
                email: email,
                address: address,
                avatar: newFile,
            }
        );
        if (req.session.userInfo.avatar != 'default.png')
            removeFile('public\\images\\user\\' + user.avatar);
        user.save();
        var newUser = await User.findOne({ id: req.session.userInfo.id });
        req.session.userInfo = newUser;
        res.json({
            message: 'Bạn đã thay đổi thông tin thành công',
        });
    }
    async password(req, res, next) {
        var categories = await Categories.find({});
        res.render('user/password', {
            layout: 'main',
            title: 'Thay đổi mật khẩu',
            session: req.session,
            categories: mongooseToObject(categories),
        });
    }
    // post
    async changePassword(req, res, next) {
        if (!req.session.login) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var oldPassword = req.body.oldPassword,
            newPassword = req.body.newPassword,
            confirmPassword = req.body.confirmPassword;
        if (!oldPassword) return res.json({ code: 401, message: 'Vui lòng nhập mật khẩu cũ' });
        if (!newPassword) return res.json({ code: 401, message: 'Vui lòng nhập mật khẩu mới' });
        if (!confirmPassword)
            return res.json({ code: 401, message: 'Vui lòng xác nhận mật khẩu mới' });
        var userDB = await User.findOne({ id: req.session.userInfo.id });
        var kq = bcrypt.compareSync(oldPassword, userDB.password);
        if (!kq) return res.json({ code: 401, message: 'Mật khẩu cũ không chính xác' });
        var user = await User.findOneAndUpdate(
            { id: req.session.userInfo.id },
            {
                password: bcrypt.hashSync(newPassword, salt),
            }
        );
        user.save();
        res.json({
            message: 'Bạn đã thay đổi thông tin thành công',
        });
    }
    // get
    async viewCart(req, res, next) {
        var categories = await Categories.find({});
        if (!req.session.login)
            return res.render('user/cart', {
                title: 'Giỏ hàng',
                layout: 'main',
                session: req.session,
                categories: mongooseToObject(categories),
            });
        var cartDB = await Cart.find({ userId: req.session.userInfo.id });
        cartDB = mongooseToObject(cartDB);
        var sum = 0;
        var count = 0;
        for (let i = 0; i < cartDB.length; i++) {
            var prod = await Product.findOne({ id: cartDB[i].productId });
            if (!prod) {
                cartDB[i].price = 0;
                cartDB[i].name = 'Sản phẩm không còn tồn tại';
                cartDB[i].slug = '#';
                cartDB[i].total = 0;
                cartDB[i].image = '404.png';
                count += 1;
                continue;
            }
            if (prod.status == 'Ngừng kinh doanh') {
                cartDB[i].price = 0;
                cartDB[i].name = 'Cửa hàng đã ngừng kinh doanh sản phẩm này';
                cartDB[i].slug = '#';
                cartDB[i].total = 0;
                cartDB[i].image = '404.png';
                count += 1;
                continue;
            }
            sum += (prod.price - prod.priceSale) * cartDB[i].quantity;
            cartDB[i].price = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(prod.price - prod.priceSale);
            cartDB[i].total = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format((prod.price - prod.priceSale) * cartDB[i].quantity);
            cartDB[i].name = prod.name;
            cartDB[i].slug = prod.slug;
            cartDB[i].image = prod.images[0];
            count += cartDB[i].quantity;
        }
        var sumText = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(sum);

        res.render('user/cart', {
            title: 'Giỏ hàng',
            layout: 'main',
            session: req.session,
            categories: mongooseToObject(categories),
            sum: sum,
            sumText: sumText,
            cart: cartDB,
            count: count,
        });
    }
    async viewThanhToan(req, res, next) {
        var categories = await Categories.find({});
        var code = req.body.code;
        var products = req.body.products;
        var ship = req.body.ship || 30000;
        products = JSON.parse(products);
        if (!req.session.login)
            return res.render('user/checkout', {
                title: 'Thanh toán',
                layout: 'main',
                session: req.session,
                categories: mongooseToObject(categories),
            });

        var discount = await Voucher.findOne({ code: code });
        discount = discount
            ? singleMongooseObject(discount)
            : {
                  price: 0,
              };
        var sum = 0;
        var count = 0;
        var cart = [];
        for (let i = 0; i < products.length; i++) {
            var prod = await Product.findOne({ id: products[i].productId });
            sum += (prod.price - prod.priceSale) * products[i].quantity;
            cart.push({
                id: products[i].productId,
                quantity: products[i].quantity,
                price: new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(prod.price - prod.priceSale),
                total: new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format((prod.price - prod.priceSale) * products[i].quantity),
                name: prod.name,
            });

            count += products[i].quantity;
        }
        var total = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(sum);
        var total2 = sum - discount.price < 0 ? 0 : sum - discount.price;
        var pay = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(total2 + ship);
        var ship = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(ship);
        var discountPrice = total2 == 0 ? sum : discount.price;
        var discountText = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(discountPrice);
        res.render('user/checkout', {
            title: 'Thanh toán',
            layout: 'main',
            session: req.session,
            categories: mongooseToObject(categories),
            total: total,
            cart: cart,
            count: count,
            ship: ship,
            pay: pay,
            discount: discountText,
            code: code,
        });
    }
    async getMoneyBeforeThanhToan(req, res, next) {
        var products = req.body.products;
        products;
        if (!req.session.login) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var sum = 0;
        console.log(products);
        for (let i = 0; i < products.length; i++) {
            var prod = await Product.findOne({ id: products[i].productId });
            sum += (prod.price - prod.priceSale) * products[i].quantity;
        }
        var total = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(sum);

        res.json({
            totalNumber: sum,
            totalText: total,
        });
    }

    async checkout(req, res, next) {
        var code = req.body.code;
        var name = req.body.name,
            address = req.body.address,
            phone = req.body.phone,
            email = req.body.email,
            xaphuong = req.body.xaphuong,
            tinhthanhpho = req.body.tinhthanhpho,
            quanhuyen = req.body.quanhuyen,
            cart = req.body.cart,
            note = req.body.note;
        if (!req.session.login) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        if (!tinhthanhpho || tinhthanhpho == -1)
            return res.json({ code: 401, message: 'Chưa lựa chọn Tỉnh/Thành phố' });
        if (!quanhuyen || quanhuyen == -1)
            return res.json({ code: 401, message: 'Chưa lựa chọn Quận/Huyện' });
        if (!xaphuong || quanhuyen == -1)
            return res.json({ code: 401, message: 'Chưa lựa chọn Xã/Phường' });
        if (!address) return res.json({ code: 401, message: 'Vui lòng nhập địa chỉ nhận hàng' });
        if (!phone) return res.json({ code: 401, message: 'Vui lòng nhập số điện thoại của bạn' });
        if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/im))
            return res.json({ code: 401, message: 'Số điện thoại không hợp lệ' });
        if (email.length > 0 && !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/im))
            return res.json({ code: 401, message: 'Email không hợp lệ' });
        var discount = await Voucher.findOne({ code: code });
        if (discount) {
            var tmp = singleMongooseObject(discount);
            var arr = tmp.userUsed;
            arr.push(req.session.userInfo.id);
            await Voucher.findOneAndUpdate(
                { code: code },
                { quantity: discount.quantity - 1, userUsed: arr }
            );
        }
        discount = discount
            ? singleMongooseObject(discount)
            : {
                  price: 0,
              };
        var sum = 0;
        var products = [];
        for (let i = 0; i < cart.length; i++) {
            var prod = await Product.findOne({ id: cart[i].id });
            if (!prod) continue;
            await Product.findOneAndUpdate(
                { id: cart[i].productId },
                {
                    quantity: prod.quantity - cart[i].quantity,
                    sold: prod.sold + cart[i].quantity,
                }
            );
            sum += (prod.price - prod.priceSale) * cart[i].quantity;
            products.push({
                id: prod.id,
                name: prod.name,
                price: prod.price - prod.priceSale,
                total: (prod.price - prod.priceSale) * cart[i].quantity,
                quantity: cart[i].quantity,
            });
        }
        var tienship = tinhthanhpho.toLocaleLowerCase().match('hà nội') ? 30000 : 45000;
        var total2 = sum - discount.price < 0 ? 0 : sum - discount.price;
        total2 = total2 + tienship;
        var sum = sum < 0 ? 0 : sum;
        sum = sum;

        var id = getID(8);
        var newOrder = new Order({
            id: id,
            userId: req.session.userInfo.id,
            products: products,
            total: total2,
            sum: sum,
            userName: name,
            address: address,
            tp: tinhthanhpho,
            qh: quanhuyen,
            xp: xaphuong,
            phone: phone,
            email: email,
            discount: discount.price,
            note: note,
            status: 'Chờ xác nhận',
        });
        newOrder.save();

        var cartAll = await Cart.find({});
        cartAll = mongooseToObject(cartAll);
        for (let i = 0; i < cartAll.length; i++) {
            for (let j = 0; j < products.length; j++) {
                if (
                    cartAll[i].userId == req.session.userInfo.id &&
                    cartAll[i].productId == products[j].id
                )
                    await Cart.findByIdAndRemove(cartAll[i]._id);
            }
        }
        res.json({ message: 'Bạn đã đặt hàng thành công', cartId: id });
    }

    async viewOrder(req, res, next) {
        var categories = await Categories.find({});
        if (!req.session.login)
            return res.render('user/orders', {
                title: 'Đơn hàng của bạn',
                layout: 'main',
                session: req.session,
                categories: mongooseToObject(categories),
            });
        var myOrders = await Order.find({
            userId: req.session.userInfo.id,
        }).sort({ createdAt: -1 });
        myOrders = mongooseToObject(myOrders);
        for (let i = 0; i < myOrders.length; i++) {
            const element = myOrders[i];
            if (
                element.status == 'Chờ xác nhận' ||
                element.status == 'Đã xác nhận' ||
                element.status == 'Người bán đang chuẩn bị đơn hàng của bạn'
            )
                element.canCancel = true;
            if (element.total > 0)
                element.total = new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(element.total);
            if (element.discount > 0)
                element.discount = new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(element.discount);
        }
        res.render('user/orders', {
            title: 'Lịch sử giao dịch',
            layout: 'main',
            session: req.session,
            categories: mongooseToObject(categories),
            count: myOrders.length,
            orders: myOrders,
        });
    }
    async orderDetails(req, res, next) {
        var categories = await Categories.find({});
        if (!req.session.login)
            return res.render('user/order-details', {
                title: 'Chi tiết đơn hàng',
                layout: 'main',
                session: req.session,
                categories: mongooseToObject(categories),
            });

        var id = req.query.id;
        var myOrder = await Order.findOne({
            id: id,
        });
        if (!myOrder)
            return res.render('user/order-details', {
                title: 'Đơn hàng không tồn tại',
                layout: 'main',
                session: req.session,
                categories: mongooseToObject(categories),
                count: 0,
            });
        myOrder = singleMongooseObject(myOrder);
        if (myOrder.ship > 0)
            myOrder.ship = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(myOrder.ship);
        if (myOrder.discount > 0)
            myOrder.discount = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(myOrder.discount);
        if (myOrder.total > 0)
            myOrder.total = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(myOrder.total);
        if (myOrder.sum > 0)
            myOrder.sum = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(myOrder.sum);

        for (let i = 0; i < myOrder.products.length; i++) {
            const element = myOrder.products[i];
            element.price = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(element.price);
            element.total = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(element.total);
        }
        var time = new Date(myOrder.createdAt);
        var date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        var month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        var minute =
            time.getMinutes() + 1 < 10 ? '0' + (time.getMinutes() + 1) : time.getMinutes() + 1;
        var hour = time.getHours() + 1 < 10 ? '0' + (time.getHours() + 1) : time.getHours() + 1;
        var dateTime = date + '/' + month + '/' + time.getFullYear() + ' ' + hour + ':' + minute;
        myOrder.createdAt = dateTime;
        if (
            myOrder.status == 'Chờ xác nhận' ||
            myOrder.status == 'Đã xác nhận' ||
            myOrder.status.match('Chuẩn bị')
        )
            myOrder.canCancel = true;
        if (myOrder.status.match('giao hàng')) myOrder.canConfirm = true;
        res.render('user/order-details', {
            title: 'Chi tiết đơn hàng',
            layout: 'main',
            session: req.session,
            categories: mongooseToObject(categories),
            count: 1,
            order: myOrder,
        });
    }
    async cancelOrder(req, res, next) {
        if (!req.session.login) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var id = req.body.id;
        var lido = req.body.lido;
        var myOrder = await Order.findOne({
            id: id,
        });
        if (!myOrder)
            return res.json({
                message: 'Đơn hàng không tồn tại',
                code: 401,
            });
        myOrder = singleMongooseObject(myOrder);
        if (
            myOrder.status == 'Chờ xác nhận' ||
            myOrder.status == 'Đã xác nhận' ||
            myOrder.status == 'Người bán đang chuẩn bị đơn hàng của bạn'
        ) {
            var myOrder = await Order.findOneAndUpdate(
                {
                    id: id,
                },
                { status: 'Đã hủy', liDoHuyHang: lido }
            );
            res.json({ message: 'Bạn đã hủy đơn hàng thành công' });
            for (let i = 0; i < myOrder.products.length; i++) {
                var prod = await Product.findOne({ id: myOrder.products[i].id });
                await Product.findOneAndUpdate(
                    { id: myOrder.products[i].id },
                    {
                        quantity: prod.quantity + myOrder.products[i].quantity,
                        sold: prod.sold - myOrder.products[i].quantity,
                    }
                );
            }
        } else if (myOrder.status == 'Đã hủy')
            res.json({ code: 401, message: 'Đơn hàng này đã được hủy' });
        else res.json({ code: 401, message: 'Đơn hàng không thể hủy' });
    }
    async confirmOrder(req, res, next) {
        if (!req.session.login) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var id = req.body.id;
        var myOrder = await Order.findOne({
            id: id,
        });
        if (!myOrder)
            return res.json({
                message: 'Đơn hàng không tồn tại',
                code: 401,
            });
        myOrder = singleMongooseObject(myOrder);
        if (myOrder.status.match('giao hàng')) {
            var myOrder2 = await Order.findOneAndUpdate(
                {
                    id: id,
                },
                { status: 'Hoàn thành' }
            );
            var lsgd = new LichSuGiaoDich({
                name: 'Cộng tiền từ đơn hàng #' + id,
                money: myOrder.total,
                type: '+',
                note: '',
            });
            lsgd.save();

            res.json({ message: 'Bạn đã xác nhận đơn hàng thành công' });
        }
        // else if (myOrder.status == 'Đã hủy')
        //     res.json({ code: 401, message: 'Đơn hàng này đã được hủy' });
        // else res.json({ code: 401, message: 'Đơn hàng không thể hủy' });
    }
    async addComment(req, res, next) {
        if (!req.session.login) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var productId = req.body.productId;
        var comment = req.body.comment;
        var star = req.body.star;
        var userId = req.session.userInfo.id;
        var orderDB = await Order.find({ userId: userId });
        var flag = false;
        var flag2 = false;
        if (!orderDB)
            return res.json({
                code: 401,
                message: 'Bạn chưa mua sản phẩm này không thể thêm bình luân',
            });
        else {
            orderDB = mongooseToObject(orderDB);
            for (let index = 0; index < orderDB.length; index++) {
                var products = orderDB[index].products;
                for (let i = 0; i < products.length; i++) {
                    const element = products[i];
                    if (element.id == productId) {
                        flag2 = true;
                        if (orderDB[index].status.toLowerCase().match('hoàn thành')) flag = true;
                    }
                }
            }
            if (!flag2)
                return res.json({
                    code: 401,
                    message: 'Bạn chưa mua sản phẩm này không thể thêm bình luân',
                });
            if (!flag) {
                return res.json({
                    code: 401,
                    message: 'Vui lòng xác nhận được đơn hàng mới có thể bình luận',
                });
            }
        }
        var myComment = await Comment.findOne({
            userId: userId,
            productId: productId,
        });
        if (!myComment) {
            var newCM = new Comment({
                productId: productId,
                comment: comment,
                star: star,
                userId: userId,
            });
            newCM.save();
            return res.json({
                code: 200,
                message: 'Thêm bình luận sản phẩm thành công',
                comment: newCM,
            });
        } else {
            await Comment.findOneAndUpdate(
                {
                    userId: userId,
                    productId: productId,
                },
                {
                    comment: comment,
                    star: star,
                }
            );
            return res.json({
                code: 200,
                message: 'Sửa bình luận sản phẩm thành công',
                comment: newCM,
            });
        }
    }
    async removeComment(req, res, next) {
        if (!req.session.login) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var productId = req.body.productId;
        var userId = req.session.userInfo.id;
        var myComment = await Comment.findOne({
            userId: userId,
            productId: productId,
        });
        if (myComment) {
            await Comment.findOneAndRemove({
                userId: userId,
                productId: productId,
            });
            return res.json({
                code: 200,
                message: 'Xóa bình luận sản phẩm thành công',
            });
        }
    }
}

module.exports = new HomeController();
