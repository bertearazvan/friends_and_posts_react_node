const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Friend = require('../models/Friend');
// Create
// create a post with the given user ID

router.post('/posts', async (req, res) => {
  const { post_title, post_body } = req.body;

  if (!sess) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }

  if (
    post_title.length < 10 ||
    post_title.length > 75 ||
    post_body.length < 20 ||
    post_body.length > 500
  ) {
    return res.status(400).send({
      message: 'Your post is too short',
    });
  }

  if (post_title.length > 20) {
    return res.status(400).send({ message: 'The title is too long' });
  }
  try {
    const newPost = await Post.query().insert({
      post_title: post_title,
      post_body: post_body,
      owner_id: sess.id,
    });
    return res.status(200).send({ message: 'Your post is online' });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong');
  }
});

//Read
//Read all the posts in cronological order

router.get('/posts', async (req, res) => {
  if (!sess) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }

  try {
    const posts = await (
      await Post.query()
        .select(
          'posts.post_body',
          'posts.post_title',
          'posts.created_at',
          'users.first_name',
          'users.last_name'
        )
        .join('users', 'posts.owner_id', 'users.id')
        .orderBy('created_at')
    ).reverse();
    return res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong');
  }
});

//^
//Update

//Delete

module.exports = router;
