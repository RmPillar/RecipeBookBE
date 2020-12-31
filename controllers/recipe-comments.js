const {
  removeRecipeComment,
  updateRecipeComment,
} = require('../models/recipe-comments');

exports.patchRecipeComment = ({ params, body }, res, next) => {
  updateRecipeComment(params.comment_id, body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteRecipeComment = ({ params }, res, next) => {
  removeRecipeComment(params.comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
