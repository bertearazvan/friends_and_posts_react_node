exports.seed = function (knex) {
  // Inserts seed entries
  return knex('friendship_statuses').insert([
    { id: 1, name: 'accept' },
    { id: 2, name: 'request' },
    { id: 3, name: 'reject' },
  ]);
};
