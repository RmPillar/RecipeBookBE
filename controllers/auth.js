const bcrypt = require('bcryptjs');

const { sendUser } = require('../models/auth');

exports.postUser = ({ body }, res, next) => {
  const newUser = {
    name: body.name,
    username: body.username,
    email: body.email,
    password: bcrypt.hashSync(body.password, 8),
  };

  sendUser(newUser)
    .then((auth) => {
      res.status(201).send(auth);
    })
    .catch(next);
};
