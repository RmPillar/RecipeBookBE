exports.up = function (knex) {
  return knex.schema.createTable('recipes', (recipesTable) => {
    recipesTable.increments('recipe_id').primary();
    recipesTable.integer('author_id').references('authors.author_id');
    recipesTable.string('name').notNullable();
    recipesTable.text('description').notNullable();
    recipesTable.decimal('quantity').notNullable();
    recipesTable.string('unit').notNullable();
    recipesTable.timestamp('last_made').default(knex.fn.now());
    recipesTable.decimal('rating', 3).notNullable();
    recipesTable.integer('completion_count').default(0);
    recipesTable.integer('comment_count').default(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('recipes');
};
