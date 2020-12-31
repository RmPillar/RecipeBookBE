const instructionCommentsRouter = require('express').Router();

const {
  deleteInstructionComment,
  patchInstructionComment,
} = require('../controllers/instruction-comments');

instructionCommentsRouter
  .route('/:comment_id')
  .delete(deleteInstructionComment)
  .patch(patchInstructionComment);

module.exports = instructionCommentsRouter;
