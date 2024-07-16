const Joi = require('joi');

exports.createUserRole = (req, res, next) => {

    const schema = Joi.object({
        user_id: Joi.number().required().messages({
            'number.base': 'User ID must be a number',
            'number.empty': 'User ID is required',
        }),
        role_id: Joi.number().required().messages({
            'number.base': 'Role ID must be a number',
            'number.empty': 'Role ID is required',
        })
    })

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
}
