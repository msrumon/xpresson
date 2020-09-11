exports.eNotFound = (req, res, next) => {
  return res.status(404).render('error', {
    headline: 'Not Found',
    description: 'The page you&apos;re looking for is not available.',
  });
};

exports.eInternalServerError = (err, req, res, next) => {
  console.error(err);
  return res.status(500).render('error', {
    headline: 'Server Problem',
    description: 'The server has encountered an unexpected problem.',
  });
};
