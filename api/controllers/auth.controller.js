const UserModel = require('../configs/db/config/db').user;
const {JWT_SECRET} = require('../configs/env')
const authController = {};

authController.login = async (req, res) => {
    try {
        const bcrypt = require("bcrypt")
        const jwt = require("jsonwebtoken")
        const { email, password } = req.body
        const user = await UserModel.findOne({
            where: { email: email },
            include: {
                association: 'roles',
                attributes: ['id','name' ],
                through: {
                    attributes: []
                  }
            }
        })
        if (!user) {
            res.status(400)
            .json(
                { 
                    error: 'Invalid email or password' 
                })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            res.status(400)
            .json(
                { 
                    error: 'Invalid email or password' 
                })
                
            
        }
        const payload = {
            user_info: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                picture: user.picture,
                mobile: user.mobile || "",
                roles: user.roles.map(role => role.name)
            }
        }

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) {
                    res.status(500).json({ error: 'Internal server error' });
                }else{
                    res.status(200).json({ token });
                }
                
            },
            
        )
        

    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = authController;