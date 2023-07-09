const Product = require('../../models/product');
const Categories = require('../../models/categories');
const ItemStatus = require('../../models/itemStatus');
const Supplier = require('../../models/supplier');
const Cart = require('../../models/cart');
const Order = require('../../models/order');
const News = require('../../models/news');
const Comment = require('../../models/comment');
const User = require('../../models/users');

const { mongooseToObject, singleMongooseObject } = require('../../ult/mongoose');
const { getTimeUTC7, removeToneVietNamese } = require('../../ult/string');

class HomeController {
    async index(req, res, next) {
        var prodNB = await Product.find({}).sort({ updatedAt: -1, sold: -1 }).limit(12);
        var prodNew = await Product.find({}).sort({ updatedAt: -1 }).limit(6);
        var categoriesLimit = await Categories.find({}).limit(5);
        var categories = await Categories.find({});
        var prod = await Product.find({});
        var news = await News.find({}).limit(3);
        prodNB = mongooseToObject(prodNB);
        prodNew = mongooseToObject(prodNew);
        categories = mongooseToObject(categories);
        prod = mongooseToObject(prod);
        news = mongooseToObject(news);
        for (let i = 0; i < categories.length; i++) {
            for (let j = 0; j < prod.length; j++) {
                if (prod[j].categories == categories[i].name)
                    categories[i].image = prod[j].images[0];
            }
        }

        for (let i = 0; i < prodNB.length; i++) {
            if (prodNB[i].priceSale > 0) {
                var priceTmp = prodNB[i].price;
                prodNB[i].price = priceTmp - prodNB[i].priceSale;
                prodNB[i].present = Math.round((prodNB[i].priceSale / priceTmp) * 100);
                prodNB[i].priceOld = new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(priceTmp);
                prodNB[i].sale = true;
            }
            if (prodNB[i].status == 'Ngừng kinh doanh') prodNB[i].stop = true;
            prodNB[i].price = prodNB[i].price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            prodNB[i].categories = removeToneVietNamese(
                prodNB[i].categories.trim().replace(/ /g, '-')
            );
        }
        var prodNewTmp = [];
        var tmp = [];
        for (let i = 0; i < prodNew.length; i++) {
            if (prodNew[i].priceSale > 0)
                prodNew[i].price = prodNew[i].price - prodNew[i].priceSale;
            prodNew[i].price = prodNew[i].price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            prodNew[i].categories = removeToneVietNamese(
                prodNew[i].categories.trim().replace(/ /g, '-')
            );
            tmp.push(prodNew[i]);
            if ((i + 1) % 3 == 0) {
                prodNewTmp.push(tmp);
                tmp = [];
            }
        }
        var productBestseller = [];
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
        var date = new Date();
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
                    SanPhamBanChay6.push(prod[j]);
                }
            }
        }
        var prodBC = [];
        var tmp3 = [];
        for (let i = 1; i < 7; i++) {
            tmp3.push(SanPhamBanChay6[i - 1]);
            if (i % 3 == 0) {
                prodBC.push(tmp3);
                tmp3 = [];
            }
        }
        for (let i = 0; i < news.length; i++) {
            const element = news[i];
            element.time = getTimeUTC7(element.createdAt).day;
        }
        res.render('site/home', {
            layout: 'main',
            title: 'Trang chủ',
            prodNB: prodNB,
            prodNew: prodNewTmp,
            prodBC: prodBC,
            categories: categories,
            categoriesLimit: mongooseToObject(categoriesLimit),
            session: req.session,
            productBestseller: productBestseller,
            news: news,
        });
    }

    async product(req, res, next) {
        var categories = await Categories.find({});
        var limit = 16;
        var page = req.query.page || 1,
            search = req.query.search,
            sort = req.query.sort,
            cat = req.query.cat || 'Tất cả';
        var productDB = null;
        var options = {};
        var skip = page == 1 ? 0 : (page - 1) * limit;
        // sort 0 = mặc định ,1= A-Z,2 Z-A, 3 giá tăng dần, 4 giảm dần
        var sortProduct = {};
        var sortText = 'Mặc định';
        if (sort == 1) {
            sortProduct = {
                name: 1,
            };
            sortText = 'Theo tên A-Z';
        } else if (sort == 2) {
            sortProduct = {
                name: -1,
            };
            sortText = 'Theo tên Z-A';
        } else if (sort == 3) {
            sortProduct = {
                price: 1,
                priceSale: -1,
            };
            sortText = 'Giá tăng dần';
        } else if (sort == 4) {
            sortProduct = {
                price: -1,
                priceSale: 1,
            };
            sortText = 'Giá giảm dần';
        }
        if (search) options.name = { $regex: search, $options: 'i' };
        if (cat && cat != 'Tất cả') options.categories = { $regex: cat };
        var count = await Product.find(options).count();
        var numberOfPage = Math.ceil(count / limit);
        if (page < 1) page = 1;
        if (page > numberOfPage) skip = (numberOfPage - 1) * limit;
        if (skip < 0) skip = 0;
        productDB = await Product.find(options)
            .limit(limit)
            .sort(sortProduct)
            .skip(skip)
            .collation({ locale: 'vi', caseLevel: true });
        productDB = mongooseToObject(productDB);
        for (let i = 0; i < productDB.length; i++) {
            if (productDB[i].priceSale > 0) {
                var priceTmp = productDB[i].price;
                productDB[i].price = priceTmp - productDB[i].priceSale;
                productDB[i].present = Math.round((productDB[i].priceSale / priceTmp) * 100);
                productDB[i].priceOld = new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(priceTmp);
                productDB[i].sale = true;
            }
            if (productDB[i].status == 'Ngừng kinh doanh') productDB[i].stop = true;
            productDB[i].price = productDB[i].price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
        }
        var number = count <= limit ? false : true;
        var pageNumber = {};
        pageNumber.list = [];
        pageNumber.before = false;
        pageNumber.after = false;
        var urlCategories = cat ? '&cat=' + cat : '';
        if (urlCategories == '&cat=Tất cả') urlCategories = '';
        var urlSort = sort ? '&sort=' + sort : '';
        var urlSearch = search ? '&search=' + search : '';

        if (count > limit) {
            var n = numberOfPage <= 3 ? numberOfPage : 3;
            var count2 = page >= numberOfPage ? numberOfPage : page;
            for (let i = 0; i < n; i++) {
                if (page == 1) {
                    pageNumber.after = true;
                    var urlPage = '&page=' + count2;
                    var link = urlSearch + urlCategories + urlSort + urlPage;
                    link = '?' + link.substring(1, link.length);
                    var active = false;
                    if (i == 0) active = true;
                    if (i == 1) pageNumber.linkAfter = link;

                    pageNumber.list.push({
                        number: count2++,
                        active: active,
                        link: link,
                    });
                } else if (page >= numberOfPage) {
                    var urlPage = '&page=' + (count2 - 1 + i);
                    var link = urlSearch + urlCategories + urlSort + urlPage;
                    link = '?' + link.substring(1, link.length);
                    var active = false;
                    if (i == n - 1) active = true;
                    if (i == n - 2) pageNumber.linkBefore = link;
                    pageNumber.list.push({
                        number: count2 - 1 + i,
                        active: active,
                        link: link,
                    });
                    pageNumber.before = true;
                    pageNumber.after = false;
                } else {
                    page = parseInt(page);
                    var urlPage = '&page=' + (page - 1);
                    var link1 = urlSearch + urlCategories + urlSort + urlPage;
                    link1 = '?' + link1.substring(1, link1.length);
                    var urlPage = '&page=' + page;
                    var link2 = urlSearch + urlCategories + urlSort + urlPage;
                    link2 = '?' + link2.substring(1, link2.length);
                    var urlPage = '&page=' + (page + 1);
                    var link3 = urlSearch + urlCategories + urlSort + urlPage;
                    link3 = '?' + link3.substring(1, link3.length);

                    pageNumber.list.push({
                        number: page - 1,
                        link: link1,
                    });
                    pageNumber.list.push({
                        number: page,
                        active: true,
                        link: link2,
                    });
                    pageNumber.list.push({
                        number: page + 1,
                        link: link3,
                    });
                    pageNumber.linkBefore = link1;
                    pageNumber.linkAfter = link3;
                    pageNumber.before = true;
                    pageNumber.after = true;
                    break;
                }
            }
        }
        res.render('site/product', {
            layout: 'main',
            title: 'Sản phẩm',
            session: req.session,
            categories: mongooseToObject(categories),
            products: productDB,
            count: count,
            number: number,
            pageNumber: pageNumber,
            search: search,
            cat: cat,
            sort: sort,
            sortText: sortText,
        });
    }

    async news(req, res, next) {
        var categories = await Categories.find({});
        var page = req.query.page || 1;
        var limit = 9;
        var count = await News.find({}).count();
        var numberOfPage = Math.ceil(count / limit);
        var skip = (page - 1) * limit;
        if (page < 1) page = 1;
        if (page > numberOfPage) skip = (numberOfPage - 1) * limit;
        if (skip < 0) skip = 0;
        var newsDB = await News.find({}).sort({ updatedAt: -1 }).limit(limit).skip(skip);
        newsDB = mongooseToObject(newsDB);
        for (let i = 0; i < newsDB.length; i++) {
            const element = newsDB[i];
            element.time = getTimeUTC7(element.createdAt).day;
        }
        var number = count <= limit ? false : true;
        var pageNumber = {};
        pageNumber.list = [];
        if (count > limit) {
            var n = numberOfPage <= 3 ? numberOfPage : 3;
            var count2 = page >= numberOfPage ? numberOfPage : page;
            for (let i = 0; i < n; i++) {
                if (page == 1) {
                    pageNumber.after = true;
                    var link = '?page=' + count2;
                    var active = false;
                    if (i == 0) active = true;
                    if (i == 1) pageNumber.linkAfter = link;
                    pageNumber.list.push({
                        number: count2++,
                        active: active,
                        link: link,
                    });
                } else if (page >= numberOfPage) {
                    var link = '?page=' + (count2 - 2 + i);
                    var active = false;
                    if (i == n - 1) active = true;
                    if (i == n - 2) pageNumber.linkBefore = link;
                    pageNumber.list.push({
                        number: count2 - 2 + i,
                        active: active,
                        link: link,
                    });
                    pageNumber.before = true;
                    pageNumber.after = false;
                } else {
                    page = parseInt(page);
                    var link1 = '?page=' + (page - 1);
                    var link2 = '?page=' + page;
                    var link3 = '?page=' + (page + 1);
                    pageNumber.list.push({
                        number: page - 1,
                        link: link1,
                    });
                    pageNumber.list.push({
                        number: page,
                        active: true,
                        link: link2,
                    });
                    pageNumber.list.push({
                        number: page + 1,
                        link: link3,
                    });
                    pageNumber.linkBefore = link1;
                    pageNumber.linkAfter = link3;
                    pageNumber.before = true;
                    pageNumber.after = true;
                    break;
                }
            }
        }
        res.render('site/news', {
            layout: 'main',
            title: 'Tin tức',
            session: req.session,
            categories: mongooseToObject(categories),
            news: newsDB,
            pageNumber: pageNumber,
            number: number,
        });
    }

    async newsDetails(req, res, next) {
        var slug = req.params.slug;
        var categories = await Categories.find({});
        var newsDB = await News.findOne({ slug: slug });
        newsDB = singleMongooseObject(newsDB);
        newsDB.time = getTimeUTC7(newsDB.createdAt).day;
        res.render('site/newsDetails', {
            layout: 'main',
            title: newsDB.title,
            session: req.session,
            categories: mongooseToObject(categories),
            news: newsDB,
        });
    }

    async contact(req, res, next) {
        var categories = await Categories.find({});
        res.render('site/contact', {
            layout: 'main',
            title: 'Liên hệ',
            session: req.session,
            categories: mongooseToObject(categories),
        });
    }

    async productDetails(req, res, next) {
        var slug = req.params.slug;
        var prod = await Product.findOne({ slug: slug });
        if (!prod)
            return res.render('site/error', {
                layout: 'main',
                session: req.session,
            });
        var productLikeDB = await Product.find({ categories: prod.categories });
        if (!productLike) productLikeDB = mongooseToObject(productLikeDB);
        var productLike = [];
        for (let i = 0; i < productLikeDB.length; i++) {
            if (prod.slug != productLikeDB[i].slug) productLike.push(productLikeDB[i]);
        }
        prod = singleMongooseObject(prod);
        if (prod.priceSale > 0) {
            var priceTmp = prod.price;
            prod.price = priceTmp - prod.priceSale;
            prod.presentSale = Math.round((prod.priceSale / priceTmp) * 100);
            prod.priceOld = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(priceTmp);
            prod.sale = true;
        }
        if (prod.quantity <= 0) prod.hetHang = true;
        if (prod.status == 'Ngừng kinh doanh') prod.stop = true;
        prod.price = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(prod.price);
        for (let i = 0; i < productLike.length; i++) {
            productLike[i].price = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(productLike[i].price);
            if (productLike[i].status == 'Ngừng kinh doanh') productLike[i].stop = true;
        }
        var categories = await Categories.find({});
        var allComment = await Comment.find({}).sort({ updatedAt: -1 });
        var comment = [];
        var cmtCount = 0;
        var myComment = {};
        var myid = req.session.userInfo ? req.session.userInfo.id : -1;
        if (allComment) {
            allComment = mongooseToObject(allComment);
            for (let i = 0; i < allComment.length; i++) {
                const element = allComment[i];
                if (element.productId == prod.id) {
                    var userInfo = await User.findOne({ id: element.userId });
                    if (userInfo) userInfo = singleMongooseObject(userInfo);
                    element.userInfo = userInfo;
                    element.time = getTimeUTC7(element.updatedAt).day;
                    if (element.userId == myid) {
                        element.isMyComment = true;
                        myComment.star = element.star;
                        myComment.comment = element.comment;
                    }
                    comment.push(element);
                    cmtCount++;
                }
            }
        }
        res.render('site/productDetails', {
            layout: 'main',
            title: prod.name,
            product: prod,
            productLike: productLike,
            session: req.session,
            categories: mongooseToObject(categories),
            comment: comment,
            cmtCount: cmtCount,
            myComment: myComment,
        });
    }

    async error(req, res, next) {
        var categories = await Categories.find({});
        res.render('site/error', {
            layout: 'main',
            title: 'Lỗi không xác định',
            session: req.session,
            categories: mongooseToObject(categories),
        });
    }
}

module.exports = new HomeController();
