const apiRouter = require('express').Router();
const recipeRouter = require('./recipes');
const categoriesRouter = require('./categories');

apiRouter.use('/recipes', recipeRouter);
apiRouter.use('/categories', categoriesRouter);

module.exports = apiRouter;
