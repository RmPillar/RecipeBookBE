const recipeRouter = require('express').Router();
const {
  getRecipes,
  postRecipes,
  getRecipe,
  deleteRecipe,
  patchRecipe,
} = require('../controllers/recipes');

recipeRouter.route('/').get(getRecipes).post(postRecipes);
recipeRouter
  .route('/:recipe_id')
  .get(getRecipe)
  .delete(deleteRecipe)
  .patch(patchRecipe);

module.exports = recipeRouter;
