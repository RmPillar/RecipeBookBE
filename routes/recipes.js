const recipeRouter = require('express').Router();
const {
  getRecipes,
  postRecipes,
  deleteRecipe,
  patchRecipe,
  getRecipeInstructions,
  getRecipeIngredients,
} = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes).post(postRecipes);

recipeRouter.route('/:recipe_id').delete(deleteRecipe).patch(patchRecipe);

recipeRouter.route('/:recipe_id/instructions').get(getRecipeInstructions);

recipeRouter.route('/:recipe_id/ingredients').get(getRecipeIngredients);

module.exports = recipeRouter;
