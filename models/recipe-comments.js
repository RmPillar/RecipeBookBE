const connection = require('../db/connection');

exports.removeRecipeComment = async (recipe_comment_id) => {
  const comment = await connection('recipe-comments')
    .where({ recipe_comment_id })
    .del()
    .returning('*');

  if (comment.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Comment Not Found',
    });
  } else {
    await connection('recipes')
      .where({
        recipe_id: comment[0].recipe_id,
      })
      .decrement({ comment_count: 1 });
  }
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
