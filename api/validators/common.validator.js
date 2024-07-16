const Joi = require('joi');

exports.id = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().required().messages({
            'number.base': 'Id must be a number',
            'number.empty': 'Id is required',
        })
    });

    const { error } = schema.validate(req.params);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
}

exports.imagePathUuidv4 = (req, res, next) => {
    
    const schema = Joi.object({
        fileName: Joi.string().pattern(new RegExp('^\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}\\.(jpg|jpeg|png|svg)$')).required().messages({
            'string.pattern.base': 'Image path must be in the format {uuid4}.jpg|jpeg|png|svg',
            'string.empty': 'Image path is required',
        })
    });

    const { error } = schema.validate({ fileName: req.params.fileName });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
}