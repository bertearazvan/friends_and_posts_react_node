import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Box } from '@material-ui/core';
import Article from '../components/Article';
import Alert from '../components/Alert';
import DotLoader from 'react-spinners/DotLoader';

const useStyles = makeStyles((theme) => ({
  alertBox: {
    position: 'absolute',
    marginTop: '2rem',
  },
  card: {
    maxWidth: '40rem',
    margin: '1rem',
  },
  articleImage: {
    width: '100%',
    height: 'auto',
  },
}));

const SavedArticles = () => {
  const classes = useStyles();
  const [articles, setArticles] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    message: {
      message: '',
      type: 'info',
    },
  });

  const getArticles = async () => {
    setLoading(true);
    setArticles([]);
    try {
      let response = await axios.get(
        'http://ec2-54-234-36-236.compute-1.amazonaws.com/news/saved-articles'
      );
      // console.log(response.data.response);

      setLoading(false);
      setArticles(response.data.response);
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

  const onDeleteArticle = async (article) => {
    try {
      await axios.delete(`http://ec2-54-234-36-236.compute-1.amazonaws.com/news/saved/${article.id}`);
      // console.log(response.data.response);
      getArticles();
    } catch (err) {
      console.log('Failed:', err);
      setAlert({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
      });
      setOpenAlert(true);
    }
    // /news/saved/:articleId
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <Container>
      <br />
      <br />
      <Grid container direction="row" justify="center">
        <Box className={classes.alertBox}>
          <Alert
            open={openAlert}
            onClose={() => setOpenAlert(false)}
            severity={alert.message.type}
          >
            {alert.message.message}
          </Alert>
        </Box>
      </Grid>
      <Grid container justify="center">
        {!loading ? (
          articles.length > 0 ? (
            articles.map((article, index) => {
              article.urlToImage = article.image_url;
              article.url = article.article_url;
              article.publishedAt = article.published_at;

              return (
                <Article
                  key={'post-' + index}
                  article={article}
                  private={true}
                  mine={true}
                  onDeleteArticle={() => onDeleteArticle(article)}
                />
              );
            })
          ) : (
              'Sorry there are no saved articles'
            )
        ) : (
            <Grid container items="center" justify="center">
              <DotLoader color={'#123abc'} />
            </Grid>
          )}
      </Grid>
    </Container>
  );
};

export default SavedArticles;
