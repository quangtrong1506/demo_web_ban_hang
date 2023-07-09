const { singleMongooseObject, mongooseToObject } = require('../../ult/mongoose');
const { removeToneVietNamese, getD, getID, getTimeUTC7 } = require('../../ult/string');
const fs = require('fs-extra');

const path = require('path');
const Supplier = require('../../models/supplier');
const ItemStatus = require('../../models/itemStatus');
const Categories = require('../../models/categories');
const Product = require('../../models/product');
const Admin = require('../../models/admin');
const User = require('../../models/users');
const Order = require('../../models/order');
const News = require('../../models/news');
const LichSuGiaoDich = require('../../models/lichsugiaodich');

function removeFile(path) {
    try {
        fs.unlinkSync(path);
    } catch (err) {
        console.error(err);
    }
}
// [GET]: /category/:slug
class adminController {
    async index(req, res, next) {
        var prodCount = await Product.find({}).count();
        var sapHetHangCount = await Product.find({ quantity: { $lt: 10 } }).count();
        var userCount = await User.find({}).count();
        var orderCount = await Order.find({}).count();
        var newUser = await User.find({}).sort({ createdAt: -1 }).limit(5);
        var newOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);
        newOrders = mongooseToObject(newOrders);
        for (let i = 0; i < newOrders.length; i++) {
            const element = newOrders[i];
            var check = {};
            if (element.status == 'Chờ xác nhận') check.b = true;
            else if (element.status == 'Đã hủy') check.d = true;
            else if (element.status.match('Hoàn thành')) check.a = true;
            else check.c = true;
            element.check = check;
            element.totalText = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(element.total);
        }
        console.log(req.session.adminInfo);
        res.render('admin/index', {
            layout: 'admin',
            title: 'Trang chủ',
            prodCount: prodCount,
            userCount: userCount,
            sapHetHangCount: sapHetHangCount,
            admin: req.session.adminInfo,
            newUser: mongooseToObject(newUser),
            newOrders: newOrders,
            orderCount: orderCount,
        });
    }
    async productManagementSite(req, res, next) {
        var prod = await Product.find({})
            .collation({ locale: 'vi', strength: 2 })
            .sort({ name: 1 });

        var cat = await Categories.find({});
        var st = await ItemStatus.find({});
        var sup = await Supplier.find({});
        prod = mongooseToObject(prod);

        for (let i = 0; i < prod.length; i++) {
            var element = prod[i];
            element.sale = element.priceSale > 0 ? true : false;
            element.img = element.images[0];
            element.statusCheck = {};
            if (element.status == 'Ngừng kinh doanh') element.statusCheck = {};
            else if (element.status.toLowerCase() == 'Còn hàng'.toLowerCase())
                element.statusCheck.a = true;
            else if (element.status.toLowerCase() == 'Sắp hết hàng'.toLowerCase())
                element.statusCheck.b = true;
            else if (element.status.toLowerCase() == 'Hết hàng'.toLowerCase())
                element.statusCheck.c = true;
            else if (element.quantity < 10 && element.quantity > 0) {
                element.statusCheck.a = false;
                element.statusCheck.b = true;
                element.status = 'Sắp hết hàng';
            } else if (element.quantity == 0) {
                element.statusCheck = {
                    d: true,
                };
                element.status = 'Hết hàng';
            }

            element.price = element.price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
        }
        res.render('admin/productManagement', {
            layout: 'admin',
            title: 'Quản lý sản phẩm',
            product: prod,
            categories: mongooseToObject(cat),
            status: mongooseToObject(st),
            supplier: mongooseToObject(sup),
            admin: req.session.adminInfo,
        });
    }
    async oderManagementSite(req, res, next) {
        var orderDB = await Order.find({}).sort({
            updatedAt: -1,
        });
        orderDB = mongooseToObject(orderDB);
        for (let i = 0; i < orderDB.length; i++) {
            var check = {
                a: false,
                b: false,
                c: false,
            };
            const element = orderDB[i];
            element.totalText = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(element.total);
            if (element.status == 'Hoàn thành') check.a = true;
            else if (element.status == 'Đã hủy') check.b = true;
            else if (element.status == 'Chờ xác nhận' || element.status == 'Đang giao hàng')
                check.c = true;
            element.check = check;
        }
        res.render('admin/oderManagement', {
            layout: 'admin',
            title: 'Quản lý đơn hàng',
            admin: req.session.adminInfo,
            orders: orderDB,
        });
    }
    //? get
    async addProductSite(req, res, next) {
        var listSupplier = await Supplier.find({});
        var listItemStatus = await ItemStatus.find({});
        var listCategories = await Categories.find({});

        res.render('admin/addProduct', {
            layout: 'admin',
            title: 'Thêm sản phẩm',
            listItemStatus: mongooseToObject(listItemStatus),
            listSupplier: mongooseToObject(listSupplier),
            listCategories: mongooseToObject(listCategories),
            admin: req.session.adminInfo,
        });
    }

    async editProductSite(req, res, next) {
        var id = req.query.id;
        var listSupplier = await Supplier.find({});
        var listItemStatus = await ItemStatus.find({});
        var listCategories = await Categories.find({});
        var product = await Product.findOne({ id: id });
        res.render('admin/editProduct', {
            layout: 'admin',
            title: 'Chỉnh sửa sản phẩm',
            listItemStatus: mongooseToObject(listItemStatus),
            listSupplier: mongooseToObject(listSupplier),
            listCategories: mongooseToObject(listCategories),
            product: singleMongooseObject(product),
            admin: req.session.adminInfo,
        });
    }
    async editNewsSite(req, res, next) {
        var id = req.query.id;
        var newsDB = await News.findOne({ id: id });
        res.render('admin/editNews', {
            layout: 'admin',
            title: 'Chỉnh sửa bài viết',
            admin: req.session.adminInfo,
            news: singleMongooseObject(newsDB),
        });
    }
    async supplierManagementSite(req, res, next) {
        var listSupplier = await Supplier.find({});
        listSupplier = mongooseToObject(listSupplier);
        var product = await Product.find({});
        product = mongooseToObject(product);
        for (let i = 0; i < listSupplier.length; i++) {
            listSupplier[i].count = 0;
            for (let j = 0; j < product.length; j++) {
                if (listSupplier[i].name == product[j].supplier) listSupplier[i].count++;
            }
        }
        res.render('admin/supplierManagement', {
            layout: 'admin',
            title: 'Quản lý nhà cung cấp',
            listSupplier: listSupplier,
            admin: req.session.adminInfo,
        });
    }
    async categoriesManagementSite(req, res, next) {
        var categories = await Categories.find({});
        categories = mongooseToObject(categories);
        var product = await Product.find({});
        product = mongooseToObject(product);
        for (let i = 0; i < categories.length; i++) {
            categories[i].count = 0;
            for (let j = 0; j < product.length; j++) {
                if (categories[i].name == product[j].categories) categories[i].count++;
            }
        }
        res.render('admin/categoriesManagement', {
            layout: 'admin',
            title: 'Quản lý danh mục sản phẩm',
            categories: categories,
            admin: req.session.adminInfo,
        });
    }
    async newsManagementSite(req, res, next) {
        var news = await News.find({}).sort({ updatedAt: -1 });
        news = mongooseToObject(news);
        for (let i = 0; i < news.length; i++) {
            const element = news[i];
            element.time = getTimeUTC7(element.createdAt).day;
        }
        res.render('admin/newsManagement', {
            layout: 'admin',
            title: 'Quản lý bài viết',
            admin: req.session.adminInfo,
            news: news,
        });
    }
    async qlDoanhThuSite(req, res, next) {
        var orders = await Order.find({});
        orders = mongooseToObject(orders);
        let labels = [];
        let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let date = new Date();
        let month = date.getMonth() + 1;
        let count = month;
        let labels2 = [];
        let year = date.getFullYear();
        for (let i = 0; i < 12; i++) {
            if (count == 0) {
                count = 12;
                year = year - 1;
                labels.push('T.' + count + '/' + (date.getFullYear() - 1));
            } else {
                labels.push('T.' + count);
            }
            let countM = count < 10 ? '0' + count : count;
            labels2.push(new Date(year + '/' + countM + '/01'));
            count--;
        }
        labels2.reverse();
        labels.reverse();
        console.log(labels2);

        for (let i = 0; i < orders.length; i++) {
            const element = orders[i];
            if (element.status.toLocaleLowerCase() != 'hoàn thành'.toLocaleLowerCase()) continue;
            let dateOfOrder = new Date(element.createdAt);
            for (let j = 0; j < labels2.length - 1; j++) {
                if (dateOfOrder > labels2[j] && dateOfOrder <= labels2[j + 1]) {
                    data[j] += element.total;
                } else if (j + 1 == labels2.length - 1 && dateOfOrder > labels2[labels2.length - 1])
                    data[j + 1] += element.total;
            }
        }
        var LichSuGiaoDichDB = await LichSuGiaoDich.find({});

        LichSuGiaoDichDB = mongooseToObject(LichSuGiaoDichDB);
        for (let i = 0; i < LichSuGiaoDichDB.length; i++) {
            const element = LichSuGiaoDichDB[i];
            element.money = element.money.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            element.time =
                getTimeUTC7(element.createdAt).day + ' - ' + getTimeUTC7(element.createdAt).time;
        }
        res.render('admin/qlDoanhThu', {
            layout: 'admin',
            title: 'Quản lý doanh thu',
            admin: req.session.adminInfo,
            labels: labels,
            data: data,
            LichSuGiaoDichDB: LichSuGiaoDichDB,
        });
    }
    async thongKeSite(req, res, next) {
        var s = req.query.s;
        var orders = await Order.find({});
        orders = mongooseToObject(orders);
        let labels = [];
        let data = [];
        let date = new Date();
        let month = date.getMonth() + 1;
        let count = month;
        for (let i = 0; i < 12; i++) {
            if (count == 0) {
                count = 12;
                labels.push('T.' + count + '/' + (date.getFullYear() - 1));
            } else labels.push('T.' + count);
            count--;
        }

        labels.reverse();

        var index = 0;
        for (let i = 0; i < orders.length; i++) {
            const element = orders[i];
            if (element.status.toLocaleLowerCase() != 'hoàn thành'.toLocaleLowerCase()) continue;
            let dateOfOrder = new Date(element.createdAt);
            if (!s || s == 'month') {
                if (dateOfOrder.getMonth() == new Date().getMonth()) index += element.total;
            } else if (s == 'year') {
                if (dateOfOrder.getFullYear() == new Date().getFullYear()) index += element.total;
            } else if (dateOfOrder.getMonth() == new Date().getMonth()) index += element.total;
        }
        var kh = await User.find({});
        var countKH = 0;
        kh = mongooseToObject(kh);
        for (let i = 0; i < kh.length; i++) {
            const element = kh[i];
            let date = new Date(element.createdAt);
            if (!s || s == 'month') {
                if (date.getMonth() == new Date().getMonth()) countKH++;
            }
            if (s == 'year') {
                if (date.getFullYear() == new Date().getFullYear()) countKH++;
            }
        }
        var dh = await Order.find({});
        var countDH = 0;
        dh = mongooseToObject(dh);
        for (let i = 0; i < dh.length; i++) {
            const element = dh[i];
            let date = new Date(element.createdAt);
            if (!s || s == 'month') {
                if (date.getMonth() == new Date().getMonth()) countDH++;
            }
            if (s == 'year') {
                if (date.getFullYear() == new Date().getFullYear()) countDH++;
            }
        }
        // sản phẩm bán chạy
        var orderDB = await Order.find({});
        orderDB = mongooseToObject(orderDB);
        var productOrders = [];
        for (let i = 0; i < orderDB.length; i++) {
            for (let j = 0; j < orderDB[i].products.length; j++) {
                productOrders.push({
                    time: orderDB[i].updatedAt,
                    product: orderDB[i].products[j],
                });
            }
        }
        var TatCaSanPhamBanDuocGanDayNhat = [];
        var countMount = date.getMonth() == 0 ? 12 : date.getMonth();
        var countYear = date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear();
        if (countMount < 10) countMount = '0' + countMount;
        var dateDK = new Date(countYear + '-' + countMount + '-' + date.getDate());
        for (let i = 0; i < productOrders.length; i++) {
            const element = productOrders[i];
            var p = await Product.findOne({ id: element.product.id });
            if (!p) continue;
            var time = new Date(element.time);
            if (i == 0) {
                TatCaSanPhamBanDuocGanDayNhat.push({
                    id: productOrders[0].product.id,
                    count: productOrders[0].product.quantity,
                });
                continue;
            }
            if (time > dateDK) {
                for (let j = 0; j < TatCaSanPhamBanDuocGanDayNhat.length; j++) {
                    if (TatCaSanPhamBanDuocGanDayNhat[j].id == productOrders[i].product.id) {
                        TatCaSanPhamBanDuocGanDayNhat[j].count += productOrders[i].product.quantity;
                        break;
                    }
                    if (j == TatCaSanPhamBanDuocGanDayNhat.length - 1)
                        TatCaSanPhamBanDuocGanDayNhat.push({
                            id: productOrders[i].product.id,
                            count: productOrders[i].product.quantity,
                        });
                }
            }
        }
        var SanPhamBanChay6 = [];
        TatCaSanPhamBanDuocGanDayNhat.sort(function (a, b) {
            if (a.count < b.count) return 1;
            if (a.count > b.count) return -1;
            return 0;
        });
        var dk =
            TatCaSanPhamBanDuocGanDayNhat.length > 6 ? 6 : TatCaSanPhamBanDuocGanDayNhat.length;
        var prod = await Product.find({});
        prod = mongooseToObject(prod);
        for (let i = 0; i < dk; i++) {
            for (let j = 0; j < prod.length; j++) {
                if (TatCaSanPhamBanDuocGanDayNhat[i].id == prod[j].id) {
                    if (prod[j].priceSale > 0) prod[j].price = prod[j].price - prod[j].priceSale;
                    prod[j].price = prod[j].price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    });
                    prod[j].categories = removeToneVietNamese(
                        prod[j].categories.trim().replace(/ /g, '-')
                    );
                    prod[j].count = TatCaSanPhamBanDuocGanDayNhat[i].count;
                    SanPhamBanChay6.push(prod[j]);
                }
            }
        }
        var prodBC = [];
        for (let i = 1; i < 7; i++) {
            prodBC.push(SanPhamBanChay6[i - 1]);
        }
        res.render('admin/thongke', {
            layout: 'admin',
            title: 'Thống kê',
            admin: req.session.adminInfo,
            labels: labels,
            tongtien: index.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }),
            countKH: countKH,
            countDH: countDH,
            prodBC: prodBC,
        });
    }
    async addNewsSite(req, res, next) {
        res.render('admin/addNews', {
            layout: 'admin',
            title: 'Thêm bài viết',
            admin: req.session.adminInfo,
        });
    }
    async loginSite(req, res, next) {
        res.render('admin/login', {
            layout: 'login',
            title: 'Đăng nhập quản trị',
        });
    }
    async errorSite(req, res, next) {
        res.render('admin/error', {
            layout: 'admin',
            title: 'Lỗi',
            admin: req.session.adminInfo,
        });
    }
    async forgotSite(req, res, next) {
        res.render('admin/forgotPassword', {
            layout: 'login',
            title: 'Quên mật khẩu',
        });
    }
    async logout(req, res, next) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        req.session.destroy();
        res.redirect('/admin/dang-nhap');
    }
    async viewOrders(req, res, next) {
        var id = req.query.id;
        var myOrder = await Order.findOne({
            id: id,
        });
        if (!myOrder) return res.redirect('/admin/error');
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
        if (
            myOrder.status == 'Chờ xác nhận' ||
            myOrder.status == 'Đã xác nhận' ||
            myOrder.status.match('Chuẩn bị')
        )
            myOrder.canCancel = true;
        if (myOrder.status == 'Chờ xác nhận') myOrder.canConfirm = true;
        if (myOrder.status.match('hủy')) myOrder.isHuyHang = true;
        var time = new Date(myOrder.createdAt);
        var date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        var month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        var minute =
            time.getMinutes() + 1 < 10 ? '0' + (time.getMinutes() + 1) : time.getMinutes() + 1;
        var hour = time.getHours() + 1 < 10 ? '0' + (time.getHours() + 1) : time.getHours() + 1;
        var dateTime = date + '/' + month + '/' + time.getFullYear() + ' ' + hour + ':' + minute;
        myOrder.createdAt = dateTime;
        res.render('admin/viewOrders', {
            layout: 'admin',
            title: 'Thông tin đơn hàng',
            admin: req.session.adminInfo,
            order: myOrder,
        });
    }
    async userManagementSite(req, res, next) {
        var userDB = await User.find({})
            .sort({
                name: 1,
            })
            .collation({ locale: 'vi', caseLevel: true });
        userDB = mongooseToObject(userDB);
        var orderDB = await Order.find();
        orderDB = mongooseToObject(orderDB);
        for (let i = 0; i < userDB.length; i++) {
            userDB[i].quantity = 0;
            for (let j = 0; j < orderDB.length; j++) {
                if (userDB[i].id == orderDB[j].userId) {
                    for (let k = 0; k < orderDB[j].products.length; k++) {
                        var element = orderDB[j].products[k];
                        userDB[i].quantity += element.quantity;
                    }
                }
            }
        }
        res.render('admin/userManagement', {
            layout: 'admin',
            title: 'Quản lý khách hàng',
            admin: req.session.adminInfo,
            users: userDB,
        });
    }
    async nhanVienManagementSite(req, res, next) {
        var adminDB = await Admin.find({ role: 'nhanvien' });
        adminDB = mongooseToObject(adminDB);
        for (let i = 0; i < adminDB.length; i++) {
            const element = adminDB[i];
            element.luong = element.luong.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
        }
        res.render('admin/nhanvienManagement', {
            layout: 'admin',
            title: 'Quản lý nhân viên',
            admin: req.session.adminInfo,
            nhanviens: adminDB,
        });
    }
    async addNhanVienSite(req, res, next) {
        res.render('admin/addNhanVien', {
            layout: 'admin',
            title: 'Thêm nhân viên',
            admin: req.session.adminInfo,
        });
    }
    async editNhanVienSite(req, res, next) {
        var id = req.query.id;
        var adminDB = await Admin.findOne({ id: id });
        adminDB = singleMongooseObject(adminDB);
        res.render('admin/editNhanVien', {
            layout: 'admin',
            title: 'Chỉnh sửa thông tin nhân viên',
            admin: req.session.adminInfo,
            nhanvien: adminDB,
        });
    }

    async theoDoiGiaoDichtSite(req, res, next) {
        res.render('admin/theoDoiGiaoDich', {
            layout: 'admin',
            title: 'Theo dõi giao dịch',
            admin: req.session.adminInfo,
        });
    }

    /////////////////////////
    //post
    async login(req, res, next) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        var admin = req.body;
        if (!admin.username && !admin.password) {
            if (!adminDB) return res.json({ code: -1, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var adminDB = await Admin.findOne({ phone: admin.username });
        if (!adminDB) adminDB = await Admin.findOne({ email: admin.username });
        if (!adminDB) return res.json({ code: -2, message: 'Không tìm thấy tài khoản' });
        else if (adminDB.password != admin.password) {
            return res.json({ code: -3, message: 'Mật khẩu không chính xác' });
        }

        var session = req.session;
        session.admin = true;
        adminDB = singleMongooseObject(adminDB);
        if (adminDB.role == 'admin') adminDB.isAdmin = true;
        session.adminInfo = adminDB;
        res.json({ code: 1, message: 'Đăng nhập thành công' });
    }
    //edit order
    async editOrder(req, res, next) {
        if (!req.session.admin) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var id = req.body.id;
        var status = req.body.status;
        var orderDB = await Order.findOne({ id: id });
        if (!orderDB) return res.json({ code: 401, message: 'Đơn hàng không tồn tại' });
        await Order.findOneAndUpdate({ id: id }, { status: status });
        res.json('Cập nhật thông tin thành công');
    }
    // add new
    async addNews(req, res, next) {
        if (!req.session.admin) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var title = req.body.title,
            content = req.body.content;
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
        if (title == '' || title == null || title == undefined)
            return res.json({ code: 401, message: 'Vui lòng tiêu đề' });
        if (images.length == 0)
            return res.json({ code: 401, message: 'Vui lòng chọn ít nhất 1 hình ảnh mô tả' });
        else {
            // lưu ảnh
            var files = images.concat(imageCKs);
            var urlImages = '';
            var urlImageCKs = [];
            for (let i = 0; i < files.length; i++) {
                const element = files[i];
                let uploadPath;
                var a = element.name.split('.');
                var b = element.mimetype.split('/');
                var iName = a[1] ? a[1] : b[1];
                var newFile =
                    removeToneVietNamese(title.replace(/ /g, '-')) +
                    '_' +
                    getD() +
                    '_' +
                    getID(12) +
                    '.' +
                    iName;
                var newPath = path.dirname(__dirname).replace('src\\app', 'public\\images\\news\\');
                uploadPath = newPath + newFile;
                i < images.length ? (urlImages = newFile) : urlImageCKs.push(newFile);
                if (iName != 'plain') {
                    element.mv(uploadPath, function (err) {
                        if (err) {
                            console.log('Không thể lưu file:' + newFile);
                        }
                    });
                }
            }
            var count = 0;
            content = content.replace(/img/g, function () {
                var a = urlImageCKs[count].split('.');
                if (a[1] != 'plain')
                    return `img src="/images/news/${urlImageCKs[count]}" alt="${
                        urlImageCKs[count++]
                    }"`;
                else return `img `;
            });
            var news = new News({
                title: title,
                image: urlImages,
                imageCKs: urlImageCKs,
                content: content,
            });
            news.save();
        }
        res.json({ message: 'Thêm bài viết thành công' });
    }
    async editNews(req, res, next) {
        if (!req.session.admin) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var title = req.body.title,
            id = req.body.id,
            content = req.body.content;
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
        var newsDB = await News.findOne({ id: id });
        if (!newsDB) return res.json({ code: 401, message: 'Bài viết không còn tồn tại' });
        if (title == '' || title == null || title == undefined)
            return res.json({ code: 401, message: 'Vui lòng tiêu đề' });
        if (images.length == 0)
            return res.json({ code: 401, message: 'Vui lòng chọn ít nhất 1 hình ảnh mô tả' });
        else {
            // xóa ảnh cũ
            var arrImageDB = newsDB.imageCKs;
            arrImageDB.push(newsDB.image);
            for (let i = 0; i < arrImageDB.length; i++) {
                const element = arrImageDB[i];
                removeFile('public\\images\\news\\' + element);
            }
            // lưu ảnh mới
            var files = images.concat(imageCKs);
            var urlImages = '';
            var urlImageCKs = [];
            for (let i = 0; i < files.length; i++) {
                const element = files[i];
                let uploadPath;
                var a = element.name.split('.');
                var b = element.mimetype.split('/');
                var iName = a[1] ? a[1] : b[1];
                var newFile =
                    removeToneVietNamese(title.replace(/ /g, '-')) +
                    '_' +
                    getD() +
                    '_' +
                    getID(12) +
                    '.' +
                    iName;
                var newPath = path.dirname(__dirname).replace('src\\app', 'public\\images\\news\\');
                uploadPath = newPath + newFile;
                i < images.length ? (urlImages = newFile) : urlImageCKs.push(newFile);
                if (iName != 'plain') {
                    element.mv(uploadPath, function (err) {
                        if (err) {
                            console.log('Không thể lưu file:' + newFile);
                        }
                    });
                }
            }
            var count = 0;
            content = content.replace(/img/g, function () {
                var a = urlImageCKs[count].split('.');
                if (a[1] != 'plain')
                    return `img src="/images/news/${urlImageCKs[count]}" alt="${
                        urlImageCKs[count++]
                    }"`;
                else return `img `;
            });
            await News.findOneAndUpdate(
                { id: id },
                {
                    title: title,
                    image: urlImages,
                    imageCKs: urlImageCKs,
                    content: content,
                }
            );
        }
        res.json({ message: 'Chỉnh sửa bài viết thành công' });
    }
    async removeNews(req, res, next) {
        var id = req.body.id;
        if (!req.session.admin) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var newsDB = await News.findOne({ id: id });
        if (!newsDB) return res.json({ code: 401, message: 'Bài viết không tồn tại' });
        await News.findOneAndRemove({ id: id });
        var arrImageDB = newsDB.imageCKs;
        arrImageDB.push(newsDB.image);
        for (let i = 0; i < arrImageDB.length; i++) {
            const element = arrImageDB[i];
            removeFile('public\\images\\news\\' + element);
        }
        res.json({ message: 'Xóa thành công' });
    }
    // add new
    async addNhanVien(req, res, next) {
        if (!req.session.admin) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var id = req.body.id,
            name = req.body.name,
            birthday = req.body.birthday,
            chucvu = req.body.chucvu,
            phone = req.body.phone,
            email = req.body.email,
            cccd = req.body.cccd,
            luong = req.body.luong;

        console.log(req.files);
        if (name == '' || name == null || name == undefined)
            return res.json({ code: 401, message: 'Vui lòng nhập lên nhân viên' });
        if (birthday == '' || birthday == null || birthday == undefined)
            return res.json({ code: 401, message: 'Vui lòng nhập ngày sinh' });
        if (chucvu == '-1') return res.json({ code: 401, message: 'Vui lòng nhập chức vụ' });
        if (luong == '' || luong == null || luong == undefined)
            return res.json({ code: 401, message: 'Vui lòng nhập lương cơ bản' });
        if (phone == '' || phone == null || phone == undefined)
            return res.json({ code: 401, message: 'Vui lòng nhập số điện thoại' });
        if (email == '' || email == null || email == undefined)
            return res.json({ code: 401, message: 'Vui lòng nhập ngày sinh' });
        if (!req.files) return res.json({ code: 401, message: 'Vui lòng chọn ảnh nhân viên' });
        else {
            const element = req.files.images;
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
            var avt = newFile;
            var newPath = path.dirname(__dirname).replace('src\\app', 'public\\admin\\images\\');
            uploadPath = newPath + newFile;
            if (iName != 'plain') {
                element.mv(uploadPath, function (err) {
                    if (err) {
                        console.log('Không thể lưu file:' + newFile);
                    }
                });
            }
            var newid = id ? id : getID(8);
            var nv = new Admin({
                id: newid,
                name: name,
                phone: phone,
                email: email,
                password: cccd,
                cccd: cccd,
                luong: luong,
                birthday: birthday,
                chucvu: chucvu,
                avatar: avt,
                role: 'nhanvien',
            });
            nv.save();
        }
        res.json({ message: 'Thêm nhân viên thành công' });
    }
    async editNhanVien(req, res, next) {
        if (!req.session.admin) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var id = req.body.id,
            name = req.body.name,
            birthday = req.body.birthday,
            chucvu = req.body.chucvu,
            phone = req.body.phone,
            email = req.body.email,
            cccd = req.body.cccd,
            luong = req.body.luong;

        console.log(req.files);
        if (name == '' || name == null || name == undefined)
            return res.json({ code: 401, message: 'Vui lòng nhập lên nhân viên' });
        if (birthday == '' || birthday == null || birthday == undefined)
            return res.json({ code: 401, message: 'Vui lòng nhập ngày sinh' });
        if (chucvu == '-1') return res.json({ code: 401, message: 'Vui lòng nhập chức vụ' });
        if (luong == '' || luong == null || luong == undefined)
            return res.json({ code: 401, message: 'Vui lòng nhập lương cơ bản' });
        if (phone == '' || phone == null || phone == undefined)
            return res.json({ code: 401, message: 'Vui lòng nhập số điện thoại' });
        if (email == '' || email == null || email == undefined)
            return res.json({ code: 401, message: 'Vui lòng nhập ngày sinh' });
        if (!req.files) return res.json({ code: 401, message: 'Vui lòng chọn ảnh nhân viên' });
        else {
            const element = req.files.images;
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
            var avt = newFile;
            var newPath = path.dirname(__dirname).replace('src\\app', 'public\\admin\\images\\');
            uploadPath = newPath + newFile;
            if (iName != 'plain') {
                element.mv(uploadPath, function (err) {
                    if (err) {
                        console.log('Không thể lưu file:' + newFile);
                    }
                });
            }
            var ad = await Admin.findOne({ id: id });
            ad = singleMongooseObject(ad);
            removeFile('public\\admin\\images\\' + ad.avatar);
            await Admin.findOneAndUpdate(
                {
                    id: id,
                },
                {
                    name: name,
                    phone: phone,
                    email: email,
                    password: cccd,
                    cccd: cccd,
                    luong: luong,
                    birthday: birthday,
                    chucvu: chucvu,
                    avatar: avt,
                }
            );
        }
        res.json({ message: 'Sửa thông tin nhân viên thành công' });
    }
    async removeNhanVien(req, res, next) {
        if (!req.session.admin) return res.json({ code: 401, message: 'Vui lòng đăng nhập lại' });
        var id = req.body.id;
        var ad = await Admin.findOne({ id: id });
        ad = singleMongooseObject(ad);
        removeFile('public\\admin\\images\\' + ad.avatar);
        await Admin.findOneAndRemove({
            id: id,
        });
        res.json({ message: 'Xóa nhân viên thành công' });
    }
}

module.exports = new adminController();
