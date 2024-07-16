const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/article.controller');
const {verifyArticle, validateGetFilteredArticles} = require('../validators/article.validator')
const {id} = require("../validators/common.validator");


// Define routes
router.get('/', ArticleController.getAll);


router.delete('/:id', id, ArticleController.deleteByPk);

router.post('/', verifyArticle, ArticleController.create);
router.post('/:id/view', id, ArticleController.incrementViewCount);
router.put('/:id', verifyArticle, ArticleController.update);

// // Additional routes

// router.post('/filter', validateGetFilteredArticles, ArticleController.getFilteredArticles);

// // Retrieve a list of articles with extended details including author info and tags title
// router.get('/details', ArticleController.getArticlesWithDetails);
// // A specific article with extended details including author info and tags title

// router.get('/details/:id', id,ArticleController.getArticleWithDetails);
// // Retrieve a list of articles by category

// router.get('/category/all/:id', id, ArticleController.getArticlesByCategory);

// router.get('/category/:id', id, ArticleController.getArticlesByCategoryPaginated);


// // Retrieve a list of articles by tag
// router.get('/tag/:id', id, ArticleController.getArticlesByTag);

// // Retrieve a list of articles by multiple tags
// router.get('/tags/:tagIds', ArticleController.getArticlesByTags);

// // Retrieve a list of articles by authorId
// router.get('/author/:id', id, ArticleController.getArticlesByAuthor);

// // Retrieve a list of articles by time-period
// router.get('/time-period', ArticleController.getArticlesByTimePeriod);

// // Retrieve the latest shared article (latest update).
// router.get('/last-shared-article', ArticleController.getLastSharedArticle);

// router.get('/:id/comments', id, ArticleController.getCommentsForArticle);


router.get('/:id', id, ArticleController.getByPk);


module.exports = router;
