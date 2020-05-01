exports.seed = async (knex) => {
  const users = await knex.select('id').from('users');
  // Inserts seed entries
  return knex('posts').insert([
    {
      id: 1,
      post_title: 'How about plants',
      post_body: 'Here is some text about plants',
      owner_id: users[0].id,
    },
    {
      id: 2,
      post_title: 'Let me tell you about facebook',
      post_body: 'Facebook is a social media platform...',
      owner_id: users[2].id,
    },
    {
      id: 3,
      post_title: 'Wanna move to UK? Here are a few things you need to know',
      post_body: 'When moving to UK you have to consider...',
      owner_id: users[0].id,
    },
  ]);
};
