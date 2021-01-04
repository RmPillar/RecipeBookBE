const connection = require('../db/connection');
const { decodeToken, rejectToken } = require('../utils/auth');
const { isEmpty } = require('lodash');

exports.updateInstruction = async (instruction_id, { body }, token) => {
  if (token) {
    const decodedToken = decodeToken(token);
    const instruction = await connection('instructions').where({
      instruction_id,
    });

    if (isEmpty(instruction))
      return Promise.reject({
        status: 404,
        msg: 'Instruction Not Found',
      });

    const recipe = await connection('recipes').where({
      recipe_id: instruction[0].recipe_id,
    });

    if (recipe[0].user_id == decodedToken.id) {
      return connection('instructions')
        .where({ instruction_id })
        .update({ body })
        .returning('*')
        .then((instruction) => instruction[0]);
    }
  }
  return rejectToken();
};

exports.removeInstruction = async (instruction_id, token) => {
  if (token) {
    const decodedToken = decodeToken(token);
    const instruction = await connection('instructions').where({
      instruction_id,
    });

    if (isEmpty(instruction))
      return Promise.reject({
        status: 404,
        msg: 'Instruction Not Found',
      });

    const recipe = await connection('recipes').where({
      recipe_id: instruction[0].recipe_id,
    });

    if (recipe[0].user_id == decodedToken.id) {
      return connection('instructions').where({ instruction_id }).del();
    }
  }
  return rejectToken();
};
