exports.up = function (knex) {
  return knex.schema.createTable('recipe-comments', (recipeCommentTable) => {
    recipeCommentTable.increments('recipe_comment_id').primary();
    recipeCommentTable
      .integer('recipe_id')
      .references('recipes.recipe_id')
      .onDelete('CASCADE');
    recipeCommentTable
      .integer('user_id')
      .references('users.user_id')
      .onDelete('CASCADE');
    recipeCommentTable.timestamp('date_posted').default(knex.fn.now());
    recipeCommentTable.text('body').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('recipe-comments');
};
