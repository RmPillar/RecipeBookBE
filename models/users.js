const jwt = require('jsonwebtoken');
const connection = require('../db/connection');

exports.createUser = (newUser) => {
  return connection('users')
    .insert(newUser)
    .returning('user_id')
    .then((user) => {
      const token = jwt.sign({ id: user.user_id }, process.env.SECRET, {
        expiresIn: 86400,
      });

      return { auth: true, token: token };
    });
};
