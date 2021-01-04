const {
  removeInstructionComment,
  updateInstructionComment,
} = require('../models/instruction-comments');

exports.patchInstructionComment = ({ params, body, headers }, res, next) => {
  const token = headers['x-access-token'];

  updateInstructionComment(params.comment_id, body, token)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteInstructionComment = ({ params, headers }, res, next) => {
  const token = headers['x-access-token'];

  removeInstructionComment(params.comment_id, token)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
