const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/siteController');
// const categoryController = require('../app/controllers/categoriesController');
// const adminController = require('../app/controllers/adminController');

router.use('/san-pham/:slug', siteController.productDetails);
router.use('/san-pham', siteController.product);
router.use('/tin-tuc', siteController.news);
router.use('/bai-viet/:slug', siteController.newsDetails);
router.use('/lien-he', siteController.contact);
router.use('/home', siteController.index);
router.use('/:slug', siteController.error);
router.use('/', siteController.index);

module.exports = router;
