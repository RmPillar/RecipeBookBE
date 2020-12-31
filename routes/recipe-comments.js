const recipeCommentsRouter = require('express').Router();

const {
  deleteRecipeComment,
  patchRecipeComment,
} = require('../controllers/recipe-comments');

recipeCommentsRouter
  .route('/:comment_id')
  .delete(deleteRecipeComment)
  .patch(patchRecipeComment);

module.exports = recipeCommentsRouter;
