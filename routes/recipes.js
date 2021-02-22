const recipeRouter = require('express').Router();
const {
  getRecipes,
  postRecipes,
  getRecipeById,
  deleteRecipe,
  patchRecipe,
  getRecipeInstructions,
  getRecipeIngredients,
  getRecipeComments,
  postRecipeComment,
} = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes).post(postRecipes);

recipeRouter
  .route('/:recipe_id')
  .get(getRecipeById)
  .delete(deleteRecipe)
  .patch(patchRecipe);

recipeRouter.route('/:recipe_id/instructions').get(getRecipeInstructions);

recipeRouter.route('/:recipe_id/ingredients').get(getRecipeIngredients);

recipeRouter
  .route('/:recipe_id/comments')
  .get(getRecipeComments)
  .post(postRecipeComment);

module.exports = recipeRouter;
