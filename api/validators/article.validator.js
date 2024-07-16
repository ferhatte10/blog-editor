const Joi = require('joi');

exports.verifyArticle = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().max(100).messages({
      'string.empty': 'Title is required',
      'string.max': 'Title must not exceed 100 characters',
    }),
    description: Joi.string().required().max(180).messages({
      'string.empty': 'Description is required',
      'string.max': 'Description must not exceed 180 characters',
    }),
    content: Joi.string().required().messages({
      'string.empty': 'Content is required',
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error });
  }

  next();
};

exports.validateGetFilteredArticles = (req, res, next) => {
  const schema = Joi.object({
    category: Joi.string().allow('').optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    dateRange: Joi.array().items(
      Joi.object({
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
        key: Joi.string().required(),
      })
    ).optional(),
    search: Joi.string().allow('').optional(),
    page: Joi.number().integer().min(1).optional(),
    pageSize: Joi.number().integer().min(1).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map((error) => error.message) });
  }

  next();
};