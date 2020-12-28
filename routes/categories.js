const categoriesRouter = require('express').Router();
const {
  getCategories,
  postCategory,
  deleteCategory,
} = require('../controllers/categories');

categoriesRouter.route('/').get(getCategories).post(postCategory);
categoriesRouter.route('/:category_id').delete(deleteCategory);

module.exports = categoriesRouter;
