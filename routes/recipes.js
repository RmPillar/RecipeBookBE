const recipeRouter = require('express').Router();
const {
  getRecipes,
  postRecipes,
  deleteRecipe,
  patchRecipe,
  getRecipeInstructions,
  patchRecipeInstructions,
  deleteRecipeInstruction,
} = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes).post(postRecipes);

recipeRouter.route('/:recipe_id').delete(deleteRecipe).patch(patchRecipe);

recipeRouter
  .route('/:recipe_id/instructions')
  .get(getRecipeInstructions)
  .patch(patchRecipeInstructions)
  .delete(deleteRecipeInstruction);

module.exports = recipeRouter;
