const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tag.controller');
const tagValidator = require('../validators/tag.validator');
const {id} = require("../validators/common.validator");

// Define routes
router.get('/', TagController.getAll);
router.get('/:id', id, TagController.getByPk);
router.delete('/:id',id, TagController.deleteByPk);
router.post('/', tagValidator.verifyTag, TagController.create);
router.put('/:id',id, tagValidator.verifyTag, TagController.update);



module.exports = router;
