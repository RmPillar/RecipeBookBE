const jwt = require('jsonwebtoken');
const privateKey = process.env.SECRET;

exports.getToken = (userID, username) => {
  const payload = { user_id: userID, username: username };
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
