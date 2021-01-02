const bcrypt = require('bcryptjs');

const { createUser, verifyUser } = require('../models/users');

exports.registerUser = ({ body }, res, next) => {
  const newUser = {
    name: body.name,
    username: body.username,
    email: body.email,
    password: bcrypt.hashSync(body.password, 8),
  };

  createUser(newUser)
    .then((auth) => {
      res.status(201).send(auth);
    })
    .catch(next);
};

exports.loginUser = ({ body }, res, next) => {
  verifyUser(body.email, body.password)
    .then((auth) => {
      res.status(201).send(auth);
    })
    .catch(next);
};
