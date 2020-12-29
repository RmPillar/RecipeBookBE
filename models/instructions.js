const connection = require('../db/connection');

exports.updateInstruction = (instruction_id, { body }) => {
  return connection('instructions')
    .where({ instruction_id })
    .update({ body })
    .returning('*')
    .then((instruction) => {
      if (instruction.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Instruction Not Found',
        });
      } else return instruction[0];
    });
};

exports.removeInstruction = (instruction_id) => {
  return connection('instructions')
    .where({ instruction_id })
    .del()
    .then((delCount) => {
      if (!delCount) {
        return Promise.reject({
          status: 404,
          msg: 'Instruction Not Found',
        });
      }
    });
};
