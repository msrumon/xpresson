export default (req, res, next) => {
  res.locals.authUser = req.session.user;
  return next();
};
