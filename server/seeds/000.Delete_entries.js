exports.seed = function (knex) {
  // Deletes ALL existing entries

  return knex('friends')
    .del()
    .then(() => {
      return knex('users').del();
    })
    .then(() => {
      return knex('saved_articles').del();
    })
    .then(() => {
      return knex('friendship_statuses').del();
    });
};
