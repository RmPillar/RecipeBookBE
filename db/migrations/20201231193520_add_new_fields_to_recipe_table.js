exports.up = function (knex) {
  return knex.schema.table('recipes', (recipesTable) => {
    recipesTable.integer('duration').notNullable();
    recipesTable.boolean('private').default(false);
    recipesTable.string('difficulty').default('easy');
  });
};

exports.down = function (knex) {
  return knex.schema.table('recipes', (recipesTable) => {
    recipesTable.dropColumn('duration');
    recipesTable.dropColumn('private');
    recipesTable.dropColumn('difficulty');
  });
};
