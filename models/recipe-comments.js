const connection = require('../db/connection');
const { decodeToken, rejectToken } = require('../utils/auth');
const { isEmpty } = require('lodash');

exports.removeRecipeComment = async (recipe_comment_id, token) => {
  if (token) {
    const decodedToken = decodeToken(token);

    const comment = await connection('recipe-comments')
      .where({ recipe_comment_id })
      .del()
      .returning('*');

    if (isEmpty(comment))
      return Promise.reject({
        status: 404,
        msg: 'Comment Not Found',
      });

    if (comment[0].user_id == decodedToken.id)
      return connection('recipes')
        .where({
          recipe_id: comment[0].recipe_id,
        })
        .decrement({ comment_count: 1 });
  }
  return rejectToken();
};

exports.updateRecipeComment = async (recipe_comment_id, { body }, token) => {
  if (token) {
    const decodedToken = decodeToken(token);

    const comment = await connection('recipe-comments').where({
      recipe_comment_id,
    });

    if (isEmpty(comment))
      return Promise.reject({
        status: 404,
        msg: 'Comment Not Found',
      });

    if (comment[0].user_id == decodedToken.id)
      return connection('recipe-comments')
        .where({ recipe_comment_id })
        .update({ body })
        .returning('*')
        .then((comment) => comment[0]);
  }
  return rejectToken();
};
