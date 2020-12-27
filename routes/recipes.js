const recipeRouter = require('express').Router();
const { getRecipes } = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes);

module.exports = recipeRouter;
