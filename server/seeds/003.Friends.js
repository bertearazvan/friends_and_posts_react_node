exports.seed = async (knex) => {
  const users = await knex.select('id').from('users');
  // console.log(users);
  return knex('friends').insert([
    {
      user_1_id: users[0].id,
      user_2_id: users[1].id,
      status: 1,
      action_user_id: users[0].id,
    },
    {
      user_1_id: users[0].id,
      user_2_id: users[2].id,
      status: 1,
      action_user_id: users[0].id,
    },
    {
      user_1_id: users[1].id,
      user_2_id: users[2].id,
      status: 2,
      action_user_id: users[1].id,
    },
  ]);
};
