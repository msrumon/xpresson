const { body } = require('express-validator');

const User = require('../models/user');

exports.register = [
  body('name').notEmpty().withMessage('Name is required!').trim().escape(),
  body('email')
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Email is invalid!')
    .trim()
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required!')
    .custom((input, { req }) => {
      if (input !== req.body.password2) {
        throw new Error('Passwords did not match!');
      }
      return true;
    }),
];

exports.login = [
  body('email')
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Email is invalid!')
    .trim()
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required!'),
];

exports.update = [
  body('name').notEmpty().withMessage('Name is required!').trim().escape(),
  body('email')
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Email is invalid!')
    .custom(async (input, { req }) => {
      if (input !== req.auth.email) {
        const user = await User.findOne({ where: { email: input } });
        if (user) {
          throw new Error('Email is already taken!');
        }
      }
      return true;
    })
    .trim()
    .normalizeEmail(),
  body('oldPassword')
    .if(body('newPassword').exists({ checkFalsy: true }))
    .notEmpty()
    .withMessage('Current password is required!')
    .custom(async (input, { req }) => {
      const isOK = await req.auth.isPasswordCorrect(input);
      if (!isOK) {
        throw new Error('Current password is incorrect!');
      }
      return true;
    }),
  body('newPassword').custom((input, { req }) => {
    if (input !== req.body.newPassword2) {
      throw new Error('New passwords did not match!');
    }
    return true;
  }),
];

exports.delete = [
  body('confirmation')
    .notEmpty()
    .withMessage('Confirmation is missing!')
    .equals('CONFIRM')
    .withMessage('Confirmation is required!')
    .trim(),
];
