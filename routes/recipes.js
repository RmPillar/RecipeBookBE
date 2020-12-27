const recipeRouter = require('express').Router();
const {
  getRecipes,
  postRecipes,
  getRecipe,
} = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes).post(postRecipes);
recipeRouter.route('/:recipe_id').get(getRecipe);

module.exports = recipeRouter;
