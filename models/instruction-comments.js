const connection = require('../db/connection');

exports.removeInstructionComment = (instruction_comment_id) => {
  return connection('instruction-comments')
    .where({ instruction_comment_id })
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
