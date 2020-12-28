const recipeRouter = require('express').Router();
const {
  getRecipes,
  postRecipes,
  getRecipe,
  deleteRecipe,
} = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes).post(postRecipes);
recipeRouter.route('/:recipe_id').get(getRecipe).delete(deleteRecipe);

module.exports = recipeRouter;
