const recipeRouter = require('express').Router();
const {
  getRecipes,
  postRecipes,
  deleteRecipe,
  patchRecipe,
  getRecipeInstructions,
  patchRecipeInstructions,
} = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes).post(postRecipes);

recipeRouter.route('/:recipe_id').delete(deleteRecipe).patch(patchRecipe);

recipeRouter
  .route('/:recipe_id/instructions')
  .get(getRecipeInstructions)
  .patch(patchRecipeInstructions);

module.exports = recipeRouter;
