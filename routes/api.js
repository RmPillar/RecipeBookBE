const apiRouter = require('express').Router();
const recipeRouter = require('./recipes');
const instructionsRouter = require('./instructions');
const ingredientsRouter = require('./ingredients');
const categoriesRouter = require('./categories');
const recipeCommentsRouter = require('./recipe-comments');
const instructionCommentsRouter = require('./instruction-comments');

apiRouter.use('/recipes', recipeRouter);
apiRouter.use('/instructions', instructionsRouter);
apiRouter.use('/ingredients', ingredientsRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/recipe-comments', recipeCommentsRouter);
apiRouter.use('/instruction-comments', instructionCommentsRouter);

module.exports = apiRouter;
