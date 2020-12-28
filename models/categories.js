const connection = require('../db/connection');

exports.fetchCategories = () => {
  return connection('categories');
};

exports.sendCategory = (newCategory) => {
  return connection('categories')
    .insert(newCategory)
    .returning('*')
    .then(([category]) => category);
};

exports.removeCategory = (category_id) => {
  return connection('categories')
    .where({ category_id })
    .del()
    .then((delCount) => {
      if (!delCount) {
        return Promise.reject({
          status: 404,
          msg: 'Category Not Found',
        });
      }
    });
};
