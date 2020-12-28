const recipeRouter = require('express').Router();
const {
  getRecipes,
  postRecipes,
  deleteRecipe,
  patchRecipe,
} = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes).post(postRecipes);
recipeRouter.route('/:recipe_id').delete(deleteRecipe).patch(patchRecipe);

module.exports = recipeRouter;
