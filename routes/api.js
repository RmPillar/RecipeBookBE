const apiRouter = require('express').Router();
const recipeRouter = require('./recipes');

apiRouter.use('/recipes', recipeRouter);

module.exports = apiRouter;
