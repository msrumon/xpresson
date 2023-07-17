import { body, param, query } from 'express-validator';

export const post = [
  body('title').notEmpty().withMessage('Title is required!').trim().escape(),
  body('content')
    .notEmpty()
    .withMessage('Content is required!')
    .trim()
    .escape(),
];

export const id = [
  param('id').isNumeric().withMessage('ID is invalid!').trim().toInt(),
];

export const comment = [
  body('comment').notEmpty().withMessage('Comment is missing!').trim().escape(),
];

export const page = [
  query('page')
    .optional()
    .isNumeric()
    .withMessage('Page number is invalid!')
    .trim()
    .toInt(),
];
