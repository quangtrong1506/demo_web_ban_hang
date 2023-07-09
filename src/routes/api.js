const express = require('express');
const router = express.Router();

const apiController = require('../app/controllers/apiController');

// danh sách trạng thái
router.use('/api/get-list-item-status', apiController.getListItemStatus);
router.use('/api/add-item-status', apiController.addItemStatus);

// danh sách danh mục
router.use('/api/get-list-categories', apiController.getListCategories);
router.use('/api/add-categories', apiController.addCategories);
router.use('/api/edit-categories', apiController.editCategories);
router.use('/api/remove-categories', apiController.removeCategories);

// danh sách nhà cung cấp
router.use('/api/get-list-supplier', apiController.getListSupplier);
router.use('/api/add-supplier', apiController.addSupplier);
router.use('/api/edit-supplier', apiController.editSupplier);
router.use('/api/remove-supplier', apiController.removeSupplier);
// sản phẩm
router.use('/api/add-product', apiController.addProduct);
router.use('/api/edit-product', apiController.editProduct);
router.use('/api/remove-product', apiController.removeProduct);

// giỏ hàng
router.use('/api/add-to-cart', apiController.addToCart);
router.use('/api/cart-info', apiController.cartInfo);
router.use('/api/update-cart', apiController.updateCart);
router.use('/api/remove-cart', apiController.removeCart);

// mã giảm giá
router.use('/api/add-voucher', apiController.addVoucher);
router.use('/api/check-voucher', apiController.checkVoucher);

// Để lại lời nhắn
router.use('/api/add-message', apiController.addMessage);
// Đăng ký nhận ưu đãi
router.use('/api/add-subscriber', apiController.addSubscriber);

//? up ảnh tạm cho ck-editor // fileUploadTemp
router.use('/api/upload-images-ck-editor', apiController.fileUploadTemp);
router.use('/api/test', apiController.Test);

// Lỗi
router.use('/api/:slug', apiController.error);

module.exports = router;
