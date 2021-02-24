const bcrypt = require('bcryptjs');
const { getToken } = require('../utils/auth');

const connection = require('../db/connection');

exports.createUser = async (newUser) => {
  const userExists = await connection('users').where({
    username: newUser.username,
  });

  if (userExists.length > 0)
    return Promise.reject({
      status: 422,
      msg: 'User already exists',
    });

  return connection('users')
    .insert(newUser)
    .returning('user_id')
    .then((user) => {
      const token = getToken(user.user_id, user.username, user.password);

      return { auth: true, token: token };
    });
};

exports.verifyUser = async (email, password = '') => {
  const [user] = await connection('users').where({ email });
  const validPassword = bcrypt.compareSync(password, user.password);

  if (user && validPassword) {
    const token = getToken(user.user_id, user.username);
    return { auth: true, token: token };
  } else {
    return Promise.reject({
      status: 401,
      msg: 'Invalid username or password',
    });
  }
};
