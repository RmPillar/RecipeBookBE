exports.up = function (knex) {
  return knex.schema.createTable(
    'recipes_categories',
    (recipesCategoriesTable) => {
      recipesCategoriesTable.increments('recipes_category_id').primary();
      recipesCategoriesTable
        .integer('category_id')
        .references('categories.category_id')
        .notNullable();
      recipesCategoriesTable
        .integer('recipe_id')
        .references('recipes.recipe_id')
        .notNullable();
    }
  );
};

exports.down = function (knex) {
  return knex.schema.dropTable('recipes_categories');
};
