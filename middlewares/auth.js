const User = require('../models/user');

module.exports = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  req.auth = await User.findByPk(req.session.user);
  return next();
};
