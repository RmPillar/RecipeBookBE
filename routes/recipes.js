const recipeRouter = require('express').Router();
const {
  getRecipes,
  postRecipes,
  deleteRecipe,
  patchRecipe,
  getRecipeInstructions,
  getRecipeIngredients,
  getRecipeComments,
} = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes).post(postRecipes);

recipeRouter.route('/:recipe_id').delete(deleteRecipe).patch(patchRecipe);

recipeRouter.route('/:recipe_id/instructions').get(getRecipeInstructions);

recipeRouter.route('/:recipe_id/ingredients').get(getRecipeIngredients);

recipeRouter.route('/:recipe_id/comments').get(getRecipeComments);

module.exports = recipeRouter;
