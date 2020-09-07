exports.index = (req, res, next) => {
  return res.render('index', { isThisHome: true });
};

exports.register = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/profile');
  }
  return res.render('auth/register', {
    errors: req.flash('errors')[0] || {},
    inputs: req.flash('inputs')[0] || {},
    notification: req.flash('notification')[0] || {},
  });
};

exports.login = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/profile');
  }
  return res.render('auth/login', {
    errors: req.flash('errors')[0] || {},
    inputs: req.flash('inputs')[0] || {},
    notification: req.flash('notification')[0] || {},
  });
};
