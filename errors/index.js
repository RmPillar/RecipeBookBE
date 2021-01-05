exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle400s = (err, req, res, next) => {
  const codes = ['42703', '22P02', '23502'];
  if (codes.includes(err.code)) res.status(400).send({ msg: 'Bad Request!!' });
  else next(err);
};

exports.handle422s = (err, req, res, next) => {
  codes = ['23503', '23505'];
  if (codes.includes(err.code))
    res.status(422).send({ msg: 'Unprocessable Request!!' });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: err.msg });
};

exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: 'Path not found!!' });
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: 'HTTP method not allowed' });
};
