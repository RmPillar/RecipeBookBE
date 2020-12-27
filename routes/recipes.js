const recipeRouter = require('express').Router();
const { getRecipes, postRecipes } = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes).post(postRecipes);

module.exports = recipeRouter;
