const { body } = require('express-validator');

const validateCreateBlog = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .trim(),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long')
    .trim(),
  
  body('author')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters')
    .trim(),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('Tags can only contain letters, numbers, hyphens, and underscores'),
  
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean value'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value')
];

const validateUpdateBlog = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .trim(),
  
  body('content')
    .optional()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long')
    .trim(),
  
  body('author')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters')
    .trim(),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('Tags can only contain letters, numbers, hyphens, and underscores'),
  
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean value'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value')
];

module.exports = {
  validateCreateBlog,
  validateUpdateBlog
};
