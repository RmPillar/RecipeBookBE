const connection = require('../db/connection');
const { decodeToken, rejectToken } = require('../utils/auth');
const { isEmpty } = require('lodash');

exports.removeInstructionComment = async (instruction_comment_id, token) => {
  if (token) {
    const decodedToken = decodeToken(token);

    const comment = await connection('instruction-comments').where({
      instruction_comment_id,
    });

    if (isEmpty(comment))
      return Promise.reject({
        status: 404,
        msg: 'Comment Not Found',
      });

    if (comment[0].user_id == decodedToken.id)
      await connection('instruction-comments')
        .where({ instruction_comment_id })
        .del();

    return connection('instructions')
      .where({
        instruction_id: comment[0].instruction_id,
      })
      .decrement({ comment_count: 1 });
  }
  return rejectToken();
};

exports.updateInstructionComment = async (
  instruction_comment_id,
  { body },
  token
) => {
  if (token) {
    const decodedToken = decodeToken(token);

    const comment = await connection('instruction-comments').where({
      instruction_comment_id,
    });

    if (isEmpty(comment))
      return Promise.reject({
        status: 404,
        msg: 'Comment Not Found',
      });

    if (comment[0].user_id == decodedToken.id)
      return connection('instruction-comments')
        .where({ instruction_comment_id })
        .update({ body })
        .returning('*')
        .then((comment) => comment[0]);
  }
  return rejectToken();
};
