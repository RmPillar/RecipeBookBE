exports.up = function (knex) {
  return knex.schema.table('recipes', (recipesTable) => {
    recipesTable.dropColumn('private');
    recipesTable.boolean('public').default(true);
  });
};

exports.down = function (knex) {
  return knex.schema.table('recipes', (recipesTable) => {
    recipesTable.dropColumn('public');
    recipesTable.boolean('private').default(false);
  });
};
