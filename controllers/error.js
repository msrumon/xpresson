export function eNotFound(_req, res) {
  return res.status(404).render('error', {
    headline: 'Not Found',
    description: 'The page you are looking for is not available.',
  });
}

export function eInternalServerError(err, _req, res) {
  console.error(err);
  return res.status(500).render('error', {
    headline: 'Server Problem',
    description: 'The server has encountered an unexpected problem.',
  });
}
