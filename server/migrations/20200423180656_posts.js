exports.up = function (knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id');
    table.string('post_title');
    table.string('post_body');
    table.integer('owner_id').unsigned().notNullable();
    table.foreign('owner_id').references('users.id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('posts');
};
