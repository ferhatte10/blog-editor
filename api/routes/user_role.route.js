const express = require('express');
const router = express.Router();
const UserRoleController = require('../controllers/user_role.controller');
const { createUserRole} = require('../validators/user_role.validator');
const { id } = require('../validators/common.validator');

// User Role
router.get('/', UserRoleController.getAll); // Done
router.get('/:id', id, UserRoleController.getByPk); //Done
router.get('/user/:id', id, UserRoleController.getByUserId); //Done
router.get('/role/:id', id, UserRoleController.getByRoleId); //Done
router.post('/', createUserRole, UserRoleController.createUserRole); //Done


module.exports = router;