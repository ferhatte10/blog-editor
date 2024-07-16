const express = require('express')
const router = express.Router()
const {checkLogin} = require('../validators/user.validator')
const authController = require('../controllers/auth.controller')
const UserController = require('../controllers/user.controller');
const {createUser, checkUserCreation} = require('../validators/user.validator')


router.post('/login', checkLogin, authController.login)
router.post('/register', checkUserCreation, createUser, UserController.createUser)

module.exports = router;



