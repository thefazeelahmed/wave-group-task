const express = require('express');
const router = express.Router();
const uploadController = require('./../controller/mediaUpload');
const upload = require('./../middleware/upload');

router.post('/', upload.single('image'), uploadController.handleUpload);

module.exports = router;
