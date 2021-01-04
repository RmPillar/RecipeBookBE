const bcrypt = require('bcryptjs');
const { getToken } = require('../utils/auth');

const connection = require('../db/connection');

exports.createUser = (newUser) => {
  return connection('users')
    .insert(newUser)
    .returning('user_id')
    .then((user) => {
      const token = getToken(user.user_id, user.username);

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
