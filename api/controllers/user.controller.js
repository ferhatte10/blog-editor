const UserModel = require('../configs/db/config/db').user;

// Define the controller methods
const UserController = {};

// Get all users
UserController.getAll = async (req, res) => {
  try {

    let users = await UserModel.findAll({
        attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user by ID
UserController.getByPk = async (req, res) => {
  let id = req.params.id;
  try {
    const user = await UserModel.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: {
            association: 'roles',
            attributes: ['id','name' ],
            through: {
                attributes: []
              }
        }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

UserController.createUser = async (req, res) => {
    try {
        const bcrypt = require("bcrypt")
        const saltRounds = 10
        const hash = await bcrypt.hash(req.body.password, saltRounds)

        let userData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            mobile: req.body.mobile,
            email: req.body.email,
            password: hash,
            ...(req.body.picture && { picture: req.body.picture })
        }

        const user = await UserModel.create(userData);
        res.status(201).json({ message: 'User created successfully'});
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

UserController.updateUser = async (req, res) => {
    try {
        let id = req.params.id
        let user = await UserModel.findByPk(id)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        
        if (req.body.password && req.body.password !== "") {
          const bcrypt = require("bcrypt")
          const saltRounds = 10
          req.body.password = await bcrypt.hash(req.body.password, saltRounds)
        }

        await user.update(req.body)

        res.status(200).json({ message: 'User updated successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// delete user
UserController.deleteUser = async (req, res) => {
    try {
        let id = req.params.id
        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy()
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = UserController;
