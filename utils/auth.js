const jwt = require('jsonwebtoken');
const privateKey = process.env.SECRET;

exports.getToken = (user_id, username, password) => {
  const payload = { user_id, username, password };
  return jwt.sign(payload, privateKey, {
    algorithm: 'HS256',
    expiresIn: 86400,
  });
};

exports.decodeToken = (token) => {
  return jwt.verify(token, privateKey);
};

exports.rejectToken = () => {
  return Promise.reject({
    status: 401,
    msg: 'Unauthorized Access',
  });
};
