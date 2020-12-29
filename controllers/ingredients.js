const { updateIngredient, removeIngredient } = require('../models/ingredients');

exports.patchIngredient = ({ params, body }, res, next) => {
  updateIngredient(params.ingredient_id, body)
    .then((ingredient) => {
      res.status(200).send({ ingredient });
    })
    .catch(next);
};

exports.deleteIngredient = ({ params }, res, next) => {
  removeIngredient(params.ingredient_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
