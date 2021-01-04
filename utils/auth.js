const jwt = require('jsonwebtoken');
const privateKey = process.env.SECRET;

module.exports = {
  getToken(userID, username) {
    const payload = { user_id: userID, username: username };
    return jwt.sign(payload, privateKey, {
      algorithm: 'HS256',
      expiresIn: 86400,
    });
  },

  decodeToken(token) {
    return jwt.verify(token, privateKey);
  },
};
