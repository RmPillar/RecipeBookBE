exports.up = function (knex) {
  return knex.schema.createTable('instructions', (instructionsTable) => {
    instructionsTable.increments('instruction_id').primary();
    instructionsTable
      .integer('recipe_id')
      .references('recipes.recipe_id')
      .onDelete('CASCADE')
      .notNullable();
    instructionsTable.text('body').notNullable();
    instructionsTable.integer('index').notNullable();
    instructionsTable.integer('comment_count').default(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('instructions');
};
