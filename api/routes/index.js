const express = require('express');
const router = express.Router();


// Mounting each route under the right path
router.use('/users', require('./user.route'))
router.use("/auth", require("./auth.route"))
router.use('/roles', require('./role.route'))
router.use('/user_roles', require('./user_role.route'))
router.use('/articles', require('./article.route'))
router.use('/tags', require('./tag.route'))
router.use('/article-tags', require('./article_tag.route'))
router.use('/categories', require('./category.route'))
router.use('/uploads', require('./upload.route'))


module.exports = router;
