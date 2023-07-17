import { validationResult, matchedData } from 'express-validator';

export async function index(req, res, next) {
  try {
    const posts = await req.auth.getPosts({ order: [['createdAt', 'DESC']] });
    return res.render('user/dashboard', {
      user: req.auth,
      posts,
      notification: req.flash('notification')[0] || {},
    });
  } catch (error) {
    return next(error);
  }
}

export function edit(req, res) {
  return res.render('user/update', {
    user: req.auth,
    errors: req.flash('errors')[0] || {},
    inputs: req.flash('inputs')[0] || {},
  });
}

export async function update(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.mapped());
    req.flash('inputs', req.body);
    return res.redirect('/profile/update');
  }
  const { name, email, newPassword } = matchedData(req);
  try {
    req.auth.name = name;
    req.auth.email = email;
    req.auth.password = newPassword;
    await req.auth.save();
    if (newPassword) {
      req.session.user = null;
      req.flash('notification', { success: 'Changed successfully!' });
      return res.redirect('/login');
    } else {
      req.flash('notification', { success: 'Updated successfully!' });
      return res.redirect('/profile');
    }
  } catch (error) {
    return next(error);
  }
}

export function erase(req, res) {
  return res.render('user/delete', {
    user: req.auth,
    errors: req.flash('errors')[0] || {},
  });
}

export async function remove(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.mapped());
    return res.redirect('/profile/delete');
  }
  try {
    await req.auth.destroy();
    req.session.user = null;
    req.flash('notification', { success: 'Deleted successfully!' });
    return res.redirect('/register');
  } catch (error) {
    return next(error);
  }
}
