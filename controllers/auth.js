import { validationResult, matchedData } from 'express-validator';

import User from '../models/user.js';

export async function register(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.mapped());
    req.flash('inputs', req.body);
    return res.redirect('/register');
  }
  const { name, email, password } = matchedData(req);
  try {
    await User.create({ name, email, password });
    req.flash('notification', { success: 'Registered successfully!' });
    return res.redirect('/login');
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
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
}

export async function logout(req, res) {
  req.session.user = null;
  req.flash('notification', { success: 'Logged out successfully!' });
  return res.redirect('/login');
}
