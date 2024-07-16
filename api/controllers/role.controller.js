const RoleModel = require('../configs/db/config/db').role;

// Define the controller methods
const RoleController = {};

RoleController.getAll = async (req, res) => {
    try {

        let roles = await RoleModel.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

RoleController.getByPk = async (req, res) => {
    let id = req.params.id;
    try {
        const user = await RoleModel.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

RoleController.createRole = async (req, res) => {
    try {
        const role = await RoleModel.create(req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

RoleController.updateRole = async (req, res) => {
    let id = req.params.id;
    try {
        const role = await RoleModel.findByPk(id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }
        await role.update(req.body);
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

RoleController.deleteRole = async (req, res) => {
    let id = req.params.id;
    try {
        const role = await RoleModel.findByPk(id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }
        await role.destroy();
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}





module.exports = RoleController;
