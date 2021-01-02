const usersRouter = require('express').Router();

const { registerUser, loginUser } = require('../controllers/users');

usersRouter.route('/register').post(registerUser);

usersRouter.route('/login').post(loginUser);

module.exports = usersRouter;
