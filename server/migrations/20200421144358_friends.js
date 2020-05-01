exports.up = function (knex) {
  return knex.schema.createTable('friends', (table) => {
    // change receiver/sender with users_1/2
    table.increments('id');
    table.integer('user_1_id').unsigned().notNullable();
    table.foreign('user_1_id').references('users.id');
    table.integer('user_2_id').unsigned().notNullable();
    table.foreign('user_2_id').references('users.id');
    table.integer('status').unsigned().notNullable();
    table.foreign('status').references('friendship_statuses.id');
    table.integer('action_user_id').unsigned().notNullable();
    table.foreign('action_user_id').references('users.id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('friends');
};
