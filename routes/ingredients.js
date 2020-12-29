const ingredientsRouter = require('express').Router();

const {
  patchIngredient,
  deleteIngredient,
} = require('../controllers/ingredients');

ingredientsRouter
  .route('/:ingredient_id')
  .patch(patchIngredient)
  .delete(deleteIngredient);

module.exports = ingredientsRouter;
