const express = require('express')
const router = express.Router()
const RoleController = require('../controllers/role.controller')
const { createRole, updateRole} = require('../validators/role.validator')
const {id} = require("../validators/common.validator");

// Role
router.get('/', RoleController.getAll);
router.get('/:id',id, RoleController.getByPk);
router.post('/', createRole, RoleController.createRole);
router.put('/:id',id, updateRole, RoleController.updateRole);
router.delete('/:id',id, RoleController.deleteRole);


module.exports = router;
