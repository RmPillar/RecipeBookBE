const connection = require('../db/connection');

exports.removeRecipeComment = (recipe_comment_id) => {
  return connection('recipe-comments')
    .where({ recipe_comment_id })
    .del()
    .then((delCount) => {
      if (!delCount) {
        return Promise.reject({
          status: 404,
          msg: 'Comment Not Found',
        });
      }
    });
};

exports.updateRecipeComment = (recipe_comment_id, { body }) => {
  return connection('recipe-comments')
    .where({ recipe_comment_id })
    .update({ body })
    .returning('*')
    .then((comment) => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Comment Not Found',
        });
      } else return comment[0];
    });
};
