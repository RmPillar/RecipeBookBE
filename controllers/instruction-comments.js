const {
  removeInstructionComment,
  updateInstructionComment,
} = require('../models/instruction-comments');

exports.patchInstructionComment = ({ params, body }, res, next) => {
  updateInstructionComment(params.comment_id, body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteInstructionComment = ({ params }, res, next) => {
  removeInstructionComment(params.comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
