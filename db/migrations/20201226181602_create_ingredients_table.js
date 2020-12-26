exports.up = function (knex) {
  return knex.schema.createTable('ingredients', (ingredientsTable) => {
    ingredientsTable.increments('ingredient_id').primary();
    ingredientsTable
      .integer('recipe_id')
      .references('recipes.recipe_id')
      .onDelete('CASCADE')
      .notNullable();
    ingredientsTable.string('name').notNullable();
    ingredientsTable.decimal('quantity', 8, 5).notNullable();
    ingredientsTable.string('unit');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('ingredients');
};
