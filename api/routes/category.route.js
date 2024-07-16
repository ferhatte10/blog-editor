const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const {verifyCategory} = require('../validators/category.validator')
const {id} = require("../validators/common.validator");


router.get('/', CategoryController.getAll);
router.delete('/:id',id,  CategoryController.deleteByPk);
router.post('/', verifyCategory, CategoryController.create);
router.put('/:id',id, verifyCategory, CategoryController.update);

router.get('/top-categories', CategoryController.getCategoriesByArticleCount);


router.get('/:id',id, CategoryController.getByPk);


module.exports = router;
