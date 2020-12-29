const instructionsRouter = require('express').Router();

const {
  patchInstruction,
  deleteInstruction,
} = require('../controllers/instructions');

instructionsRouter
  .route('/:instruction_id')
  .patch(patchInstruction)
  .delete(deleteInstruction);

module.exports = instructionsRouter;
