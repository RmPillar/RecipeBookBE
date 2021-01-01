const authRouter = require('express').Router();

const { postUser } = require('../controllers/auth');

authRouter.route('/register').post(postUser);

module.exports = authRouter;
