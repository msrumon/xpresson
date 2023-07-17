export function index(_req, res) {
  return res.render('index', { isThisHome: true });
}

export function register(req, res) {
  if (req.session.user) {
    return res.redirect('/profile');
  }
  return res.render('auth/register', {
    errors: req.flash('errors')[0] || {},
    inputs: req.flash('inputs')[0] || {},
    notification: req.flash('notification')[0] || {},
  });
}

export function login(req, res) {
  if (req.session.user) {
    return res.redirect('/profile');
  }
  return res.render('auth/login', {
    errors: req.flash('errors')[0] || {},
    inputs: req.flash('inputs')[0] || {},
    notification: req.flash('notification')[0] || {},
  });
}
