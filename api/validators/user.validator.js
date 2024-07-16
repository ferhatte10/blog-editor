const e = require('express');
const Joi = require('joi');
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const {user} = require('../configs/db/config/db')


exports.createUser = (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().max(20).required().messages({
      'string.empty': 'first_name is required',
      'string.max': 'first_name must not exceed 20 characters',
    }),
    last_name: Joi.string().max(20).required().messages({
      'string.empty': 'Last name is required',
      'string.max': 'Last name must not exceed 20 characters',
    }),
    mobile: Joi.string().max(30).optional().allow(null).allow('').messages({
      'string.max': 'Mobile must not exceed 30 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email',
    }),
    password: Joi.string().min(6).max(100).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password must not exceed 100 characters',
    }),
    picture: Joi.string().max(100).allow(null).allow('')
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

exports.updateUser = (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().max(20).messages({
      'string.max': 'first_name must not exceed 20 characters',
    }),
    last_name: Joi.string().max(20).messages({
      'string.max': 'Last name must not exceed 20 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email',
    }),
    mobile: Joi.string().max(30).messages({
      'string.max': 'Mobile must not exceed 30 characters',
    }),
    password: Joi.string().max(100).optional().allow(null).messages({
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password must not exceed 100 characters',
    }),
    picture: Joi.string().max(100).optional().allow(null).allow('')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

exports.checkLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email'
    }),
    
    password: Joi.string().max(100).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password must not exceed 100 characters'
    })

  })

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

exports.checkUserCreation = (req, res, next) => {
  const storage_create = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/users_pictures')
    },
    filename: function (req, file, cb) {
      const UUID = uuidv4()
      req.body.picture = `${UUID}.${file.originalname.split('.')[1]}`
      cb(null, `${UUID}.${file.originalname.split('.')[1]}`)
    }
  })
  const upload = multer({
      storage: storage_create,
      limits: {
          fileSize: 5 * 1024 * 1024,
          files: 1
      },
      fileFilter(req, file, cb) {
        user.findOne({ where: { email: req.body.email } }).then((User) => {
          if (User) {
            cb(new Error('Email already exists'),false)
          }else if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
              cb(new Error('File extension not allowed'),false)
          } else {
            cb(undefined, true)
          }
        })
      }

  }).single('picture') // only one file to be uploaded
  
  upload(req, res, (err) => {
      if (err) { // if multer encounters an error he handles it
        return res.status(400).json({ error: err.message })
      } else if (err) { // if no file is uploaded
          return res.status(500).json({ error: 'Internal error' })
      }else {
        next()
      }
  }) 
}

exports.checkUserUpdate = (req, res, next) => {
  const storage_create = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/users_pictures')
    },
    filename: function (req, file, cb) {
      const UUID = uuidv4()
      req.body.picture = `${UUID}.${file.originalname.split('.')[1]}`
      cb(null, `${UUID}.${file.originalname.split('.')[1]}`)
    }
  })
  const upload = multer({
      storage: storage_create,
      limits: {
          fileSize: 5 * 1024 * 1024,
          files: 1
      },
      fileFilter(req, file, cb) {
    
        if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
            cb(new Error('File extension not allowed'),false)
        } else {
          cb(undefined, true)
        } 
      }

  }).single('picture') // only one file to be uploaded
  
  upload(req, res, (err) => {
      if (err) { // if multer encounters an error he handles it
        return res.status(400).json({ error: err.message })
      } else if (err) { // if no file is uploaded
          return res.status(500).json({ error: 'Internal error' })
      }else {
        next()
      }
  }) 
}
