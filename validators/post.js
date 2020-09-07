const { body, param, query } = require('express-validator');

exports.post = [
  body('title').notEmpty().withMessage('Title is required!').trim().escape(),
  body('content')
    .notEmpty()
    .withMessage('Content is required!')
    .trim()
    .escape(),
];

exports.id = [
  param('id').isNumeric().withMessage('ID is invalid!').trim().toInt(),
];

exports.comment = [
  body('comment').notEmpty().withMessage('Comment is missing!').trim().escape(),
];

exports.page = [
  query('page')
    .optional()
    .isNumeric()
    .withMessage('Page number is invalid!')
    .trim()
    .toInt(),
];
