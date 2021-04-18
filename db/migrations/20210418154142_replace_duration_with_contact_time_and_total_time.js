exports.up = function (knex) {
  return knex.schema.table('recipes', (recipesTable) => {
    recipesTable.dropColumn('duration');
    recipesTable.integer('contact_time').notNullable();
    recipesTable.integer('total_time').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('recipes', (recipesTable) => {
    recipesTable.dropColumn('contact_time');
    recipesTable.dropColumn('total_time');
    recipesTable.integer('duration').notNullable();
  });
};
