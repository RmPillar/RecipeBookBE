const connection = require('../db/connection');

exports.removeInstructionComment = async (instruction_comment_id) => {
  const comment = await connection('instruction-comments')
    .where({ instruction_comment_id })
    .del()
    .returning('*');

  if (comment.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Comment Not Found',
    });
  } else {
    await connection('instructions')
      .where({
        instruction_id: comment[0].instruction_id,
      })
      .decrement({ comment_count: 1 });
  }
};

exports.updateInstructionComment = (instruction_comment_id, { body }) => {
  return connection('instruction-comments')
    .where({ instruction_comment_id })
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
