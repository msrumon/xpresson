const { validationResult, matchedData } = require('express-validator');

const User = require('../models/user');

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.mapped());
    req.flash('inputs', req.body);
    return res.redirect('/register');
  }
  const { name, email, password } = matchedData(req);
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      req.flash('notification', { danger: 'Email is already registered!' });
      req.flash('inputs', req.body);
      return res.redirect('/register');
    }
    await User.create({ name, email, password });
    req.flash('notification', { success: 'Registered successfully!' });
    return res.redirect('/login');
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.mapped());
    req.flash('inputs', req.body);
    return res.redirect('/login');
  }
  const { email, password } = matchedData(req);
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash('notification', { danger: 'Email is not registered!' });
      req.flash('inputs', req.body);
      return res.redirect('/login');
    }
    const isOK = await user.isPasswordCorrect(password);
    if (!isOK) {
      req.flash('notification', { danger: 'Password is incorrect!' });
      req.flash('inputs', req.body);
      return res.redirect('/login');
    }
    req.session.user = user.id;
    return res.redirect('/profile');
  } catch (error) {
    return next(error);
  }
};

exports.logout = async (req, res, next) => {
  req.session.user = null;
  req.flash('notification', { success: 'Logged out successfully!' });
  return res.redirect('/login');
};
