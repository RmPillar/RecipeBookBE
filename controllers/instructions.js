const {
  updateInstruction,
  removeInstruction,
} = require('../models/instructions');

exports.patchInstruction = ({ params, body, headers }, res, next) => {
  const token = headers['x-access-token'];

  updateInstruction(params.instruction_id, body, token)
    .then((instruction) => {
      res.status(200).send({ instruction });
    })
    .catch(next);
};

exports.deleteInstruction = ({ params, headers }, res, next) => {
  const token = headers['x-access-token'];

  removeInstruction(params.instruction_id, token)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
