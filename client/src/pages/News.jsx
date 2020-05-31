import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Typography } from '@material-ui/core';
import Alert from '../components/Alert';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import DotLoader from 'react-spinners/DotLoader';
import moment from 'moment';

import Article from '../components/Article';
import NewsFilterBox from '../components/NewsFilterBox';

const useStyles = makeStyles((theme) => ({
  alertBox: {
    position: 'fixed',
    zIndex: '10',
    marginTop: '3rem',
  },
  buttonFriendRequest: {
    margin: '1rem',
  },
}));

const News = (props) => {
  const classes = useStyles();
  const [alert, setAlert] = useState({
    message: {
      message: '',
      type: 'info',
    },
  });
  const [loading, setLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [sources, setSources] = useState([]);
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({
    channels: ['cnn'],
    type: 'headlines',
  });

  let user = '';
  if (localStorage.getItem('user')) {
    user = JSON.parse(localStorage.getItem('user'));
  }

  const onFilter = (data) => {
    setForm(data);
  };

  const getSources = async () => {
    try {
      let response = await axios.get('http://ec2-54-234-36-236.compute-1.amazonaws.com/news/sources');
      setSources(response.data.sources);
      // console.log(response.data.sources);
    } catch (err) {
      console.log('Failed:', err);
      setAlert({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
      });
      setOpenAlert(true);
      setLoading(false);
    }
  };

  const getTopHeadlines = async () => {
    try {
      setLoading(true);
      if (form.type === 'headlines') {
        let response = await axios.get(
          'http://ec2-54-234-36-236.compute-1.amazonaws.com/news/top-headlines',
          {
            params: {
              channels: form.channels,
              phrase: form.phrase,
              countries: form.countries,
              categories: form.categories,
            },
          }
        );

        console.log(response.data.articles);
        setArticles(response.data.articles);
        setLoading(false);
      }

      if (form.type === 'everything') {
        let response = await axios.get(
          'http://ec2-54-234-36-236.compute-1.amazonaws.com/news/everything',
          {
            params: {
              sortBy: form.sort,
              phrase: form.phrase,
              languages: form.languages,
              channels: form.channels,
              from: form.fromDate,
              to: form.toDate,
            },
          }
        );

        console.log(response.data.articles);
        setArticles(response.data.articles);
        setLoading(false);
      }
    } catch (err) {
      console.log('Failed:', err);
      setAlert({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
      });
      setOpenAlert(true);
      setLoading(false);
    }
  };

  const onSaveArticle = async (article) => {
    // console.log(article);
    try {
      let response = await axios.post('http://ec2-54-234-36-236.compute-1.amazonaws.com/news/save', {
        author: article.author,
        source: article.source.name,
        title: article.title,
        imgUrl: article.urlToImage,
        articleUrl: article.url,
        description: article.content,
        publishedAt: moment(article.publishedAt).format('YYYY-MM-DD HH:mm:ss'),
      });

      setAlert({
        message: {
          message: response.data.response,
          type: 'success',
        },
      });
      setOpenAlert(true);
      // console.log(response.data.response);
    } catch (err) {
      console.log('Failed:', err);
      setAlert({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
      });
    }
  };

  useEffect(() => {
    getSources();
    getTopHeadlines();
  }, [form]);

  // console.log('friends', friends);
  // TODO: add a message.show

  if (user) {
    return (
      <Container>
        <Box>
          <Grid container direction="row" justify="center" alignItems="center">
            <Box className={classes.alertBox}>
              <br />
              <Alert
                open={openAlert}
                onClose={() => setOpenAlert(false)}
                severity={alert.message.type}
              >
                {alert.message.message}
              </Alert>
            </Box>
          </Grid>
          <Grid
            style={{ marginTop: '3rem' }}
            spacing={2}
            container
            justify="center"
          >
            <Grid item xs={12} sm={6}>
              <NewsFilterBox
                sources={sources}
                onAddFilter={(data) => onFilter(data)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {!loading ? (
                articles.length > 0 ? (
                  articles.map((article, index) => {
                    return (
                      <Article
                        key={'news-' + index}
                        article={article}
                        onSaveArticle={() => onSaveArticle(article)}
                      />
                    );
                  })
                ) : (
                    <Grid container items="center" justify="center">
                      <Typography variant="h5" component="h2">
                        Sorry, no news were found...
                    </Typography>
                    </Grid>
                  )
              ) : (
                  <Grid container items="center" justify="center">
                    <DotLoader color={'#123abc'} />
                  </Grid>
                )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    );

    // input to add a friend
    // card with friends
    // you can block any friend
    // see posts
  } else {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <Box className={classes.alertBox}>
          <br />
          <Alert severity={'error'}>Sorry, you have to be logged in</Alert>
        </Box>
      </Grid>
    );
  }
};

export default News;
