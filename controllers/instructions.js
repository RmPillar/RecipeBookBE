const {
  updateInstruction,
  removeInstruction,
} = require('../models/instructions');

exports.patchInstruction = ({ params, body }, res, next) => {
  updateInstruction(params.instruction_id, body)
    .then((instruction) => {
      res.status(200).send({ instruction });
    })
    .catch(next);
};

exports.deleteInstruction = ({ params }, res, next) => {
  removeInstruction(params.instruction_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
