const express = require('express');
const router = express.Router();
const {
    getFile,
    getDefaultFile,
    getFileByName
} = require('../controllers/uploads.controller');

const { imagePathUuidv4 } = require('../validators/common.validator');

// Endpoint to get default files
router.get('/default', getDefaultFile);

// Endpoint to its user picture
router.get('/user', getFile);

// Endpoint to get image by name
router.get('/:fileName',imagePathUuidv4, getFileByName);

module.exports = router;
