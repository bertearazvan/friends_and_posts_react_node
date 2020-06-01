const router = require('express').Router();
const User = require('../models/User');
const Friend = require('../models/Friend');
const SavedArticles = require('../models/Saved_articles');

const moment = require('moment');
// news api
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('b9b0a45a51a14cceb336c36144b125c6');
// Create
// create a post with the given user ID

router.delete('/news/saved/:articleId', async (req, res) => {
  const { articleId } = req.params;
  if (!req.session.user) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }

  try {
    const articleDelete = await SavedArticles.query()
      .delete()
      .where({ id: articleId, owner_id: req.session.user.id });

    console.log(articleDelete);

    return res.status(200).send({ response: 'Deleted successfully.' });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

router.get('/news/top-headlines', async (req, res) => {
  const { channels, categories, countries, phrase } = req.query;
  if (!req.session.user) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }
  const userId = req.session.user.id;

  try {
    const headlines = await newsapi.v2.topHeadlines({
      q: phrase === undefined ? '' : phrase,
      category: categories === undefined ? '' : categories,
      sources: channels === undefined ? '' : channels,
      country: countries === undefined ? '' : countries,
      pageSize: 100,
    });

    return res.status(200).send(headlines);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

router.get('/news/everything', async (req, res) => {
  const { sortBy, languages, channels, phrase, from, to } = req.query;
  console.log(channels);
  if (!req.session.user) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }
  const userId = req.session.user.id;

  try {
    const headlines = await newsapi.v2.everything({
      q: phrase === undefined ? '' : phrase,
      from: from === undefined ? '' : moment(from).format('YY-MM-DD'),
      sources: channels === undefined ? '' : channels,
      language: languages === undefined ? '' : languages,
      size: 100,
      sortBy: sortBy === undefined ? '' : sortBy,
      to: to === undefined ? '' : moment(to).format('YY-MM-DD'),
    });

    return res.status(200).send(headlines);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

router.get('/news/sources', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }

  try {
    const sources = await newsapi.v2.sources({
      language: 'en',
    });
    return res.status(200).send(sources);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

router.post('/news/save', async (req, res) => {
  const {
    author,
    source,
    title,
    imgUrl,
    description,
    articleUrl,
    publishedAt,
  } = req.body;

  if (!req.session.user) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }

  try {
    const article = await SavedArticles.query().insert({
      author: author ? author : null,
      source: source ? source : null,
      title: title ? title : null,
      image_url: imgUrl ? imgUrl : null,
      article_url: articleUrl ? articleUrl : null,
      description: description ? description : null,
      published_at: publishedAt ? publishedAt : null,
      owner_id: req.session.user.id,
    });
    // console.log(article);
    if (article) {
      return res.status(200).send({ response: 'Article saved' });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

router.get('/news/saved-articles', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }

  try {
    const articles = await SavedArticles.query()
      .select()
      .where({ owner_id: req.session.user.id });

    res.status(200).send({ response: articles });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

//^
//Update

//Delete

module.exports = router;
