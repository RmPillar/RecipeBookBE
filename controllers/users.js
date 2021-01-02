const bcrypt = require('bcryptjs');

const { createUser } = require('../models/users');

exports.registerUser = ({ body }, res, next) => {
  const newUser = {
    name: body.name,
    username: body.username,
    email: body.email,
    password: bcrypt.hashSync(body.password, 8),
  };

  createUser(newUser)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};

exports.loginUser = ({ body }, res, next) => {};
