const Joi = require('joi');

exports.createRole = (req, res, next) => {

    const schema = Joi.object({
        name: Joi.string().max(20).required().messages({
            'string.empty': 'Name is required',
            'string.max': 'Name must not exceed 20 characters',
        })
    })

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
}

exports.updateRole = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().max(20).messages({
            'string.max': 'Name must not exceed 20 characters',
        })
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
}
