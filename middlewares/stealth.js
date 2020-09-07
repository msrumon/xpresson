module.exports = (req, res, next) => {
  res.locals.authUser = req.session.user;
  return next();
};
