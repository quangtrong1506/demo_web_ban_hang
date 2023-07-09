const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/siteController');
const uploadController = require('../app/controllers/uploadController');

router.use('/upload/images/temp', uploadController.uploadImage);
router.use('/', siteController.error);

module.exports = router;
