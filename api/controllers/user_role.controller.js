const { attempt } = require('joi');
const {
    user,
    role,
    user_role
  } = require('../configs/db/config/db'); 
  
  // Define controller methods
  const controller = {};
  
  // Create a new article_tag association
  controller.createUserRole = async (req, res) => {
    try {
      const { user_id, role_id } = req.body;
      const userRole = await user_role.create({ user_id, role_id });
      res.status(201).json(userRole);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get all user_role associations
  controller.getAll = async (req, res) => {
    try {
      const userRoles = await user_role.findAll();
      if (userRoles.length === 0) {
        res.status(404).json({ error: 'User Roles not found' });
      }
      res.status(200).json(userRoles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get a user_role association by primary key
  controller.getByPk = async (req, res) => {
    try {
        
      const userRole = await user_role.findAll({
        where: {
          id: req.params.id
        },
        attributes: [],
        include: [
            {
                model: user,
                attributes: ['id', 'first_name', 'last_name', 'email']
            }, 
            {
                model: role,
                attributes: ['id', 'name']
            }
            
        ]
      
      });
      if (userRole === null || userRole.length === 0) {
        res.status(404).json({ error: 'User Role not found' });
      } else {
        res.status(200).json(userRole);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get all user_role associations by user id
  controller.getByUserId = async (req, res) => {
    try {
      const userRole = await user_role.findAll({
        where: {
          user_id: req.params.id
        },
        attributes: [],
        include: [
            {
                model: user,
                attributes: ['id', 'first_name', 'last_name', 'email']
            }, 
            {
                model: role,
                attributes: ['id', 'name']
            }
        ]
      })
      if (userRole === null || userRole.length === 0) {
        res.status(404).json({ error: 'User Role not found' });
      } else {
        res.status(200).json(userRole);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get all user_role associations by role id
  controller.getByRoleId = async (req, res) => {
    try {
      const userRole = await user_role.findAll({
        where: {
          role_id: req.params.id
        },
        attributes: [],
        include: [
            {
                model: user,
                attributes: ['id', 'first_name', 'last_name', 'email']
            }, 
            {
                model: role,
                attributes: ['id', 'name']
            }
        ]
      
      });
      if (userRole === null || userRole.length === 0) {
        res.status(404).json({ error: 'User Role not found' });
      } else {
        res.status(200).json(userRole);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  module.exports = controller;
  