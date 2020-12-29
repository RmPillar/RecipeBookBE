const apiRouter = require('express').Router();
const recipeRouter = require('./recipes');
const instructionsRouter = require('./instructions');
const categoriesRouter = require('./categories');

apiRouter.use('/recipes', recipeRouter);
apiRouter.use('/instructions', instructionsRouter);
apiRouter.use('/categories', categoriesRouter);

module.exports = apiRouter;
