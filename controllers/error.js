exports.eNotFound = (req, res, next) => {
  return res.status(404).send('Not Found!');
};

exports.eInternalServerError = (err, req, res, next) => {
  console.error(err);
  return res.status(500).send('Server Problem!');
};
