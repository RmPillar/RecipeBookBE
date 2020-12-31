exports.up = function (knex) {
  return knex.schema.createTable(
    'instruction-comments',
    (instructionCommentTable) => {
      instructionCommentTable.increments('instruction_comment_id').primary();
      instructionCommentTable
        .integer('instruction_id')
        .references('instructions.instruction_id')
        .onDelete('CASCADE');
      instructionCommentTable
        .integer('user_id')
        .references('users.user_id')
        .onDelete('CASCADE');
      instructionCommentTable.timestamp('date_posted').default(knex.fn.now());
      instructionCommentTable.text('body').notNullable();
    }
  );
};

exports.down = function (knex) {
  return knex.schema.dropTable('instruction-comments');
};
