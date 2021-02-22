const { fetchCategories, fetchCategoryById } = require('../models/categories');

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getCategoryById = ({ params }, res, next) => {
  fetchCategoryById(params.category_id)
    .then((category) => {
      res.status(200).send({ category: category[0] });
    })
    .catch(next);
};
