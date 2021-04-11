const connection = require('../db/connection');

exports.fetchCategories = () => {
  return connection('categories');
};

exports.fetchCategoryById = (category_id) => {
  return connection('categories').where({ category_id });
};
