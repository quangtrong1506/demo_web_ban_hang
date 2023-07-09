const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/userController');

//? get methods

router.use('/user/dang-xuat', userController.logout);
router.use('/user/thong-tin-ca-nhan', userController.info);
router.use('/user/mat-khau', userController.password);
router.use('/user/gio-hang', userController.viewCart);
router.use('/user/don-hang', userController.viewOrder);
router.use('/user/chi-tiet-don-hang', userController.orderDetails);

// post method
router.use('/user/thanh-toan', userController.viewThanhToan);
router.use('/user/add-comment', userController.addComment);
router.use('/user/delete-comment', userController.removeComment);

router.use('/user/dang-ky', userController.register);
router.use('/user/dang-nhap', userController.login);
router.use('/user/quen-mat-khau', userController.forgotPassword);
router.use('/user/thay-doi-thong-tin-ca-nhan', userController.changeInfo);
router.use('/user/thay-doi-mat-khau', userController.changePassword);
router.use('/user/checkout', userController.checkout);
router.use('/user/cancel-order', userController.cancelOrder);
router.use('/user/confirm-order', userController.confirmOrder);
router.use('/user/check-total-before-checkout', userController.getMoneyBeforeThanhToan);

module.exports = router;
