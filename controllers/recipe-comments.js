const {
  removeRecipeComment,
  updateRecipeComment,
} = require('../models/recipe-comments');

exports.patchRecipeComment = ({ params, body, headers }, res, next) => {
  const token = headers['x-access-token'];

  updateRecipeComment(params.comment_id, body, token)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteRecipeComment = ({ params, headers }, res, next) => {
  const token = headers['x-access-token'];

  removeRecipeComment(params.comment_id, token)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
