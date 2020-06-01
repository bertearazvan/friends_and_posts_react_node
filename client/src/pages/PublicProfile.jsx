import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, Container, Typography } from '@material-ui/core';
import DotLoader from 'react-spinners/DotLoader';
import Alert from '../components/Alert';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import Article from '../components/Article';

const useStyles = makeStyles((theme) => ({
  alertBox: {
    position: 'fixed',
    marginTop: '3rem',
  },
  profileForm: {
    gridTemplateColumns: '66fr 33fr',
  },
  card: {
    position: 'fixed',
    width: '40%',
    padding: '1rem',
    margin: '1rem',
  },
  profileImage: {
    width: '8rem',
    height: '8rem',
    borderRadius: '4rem',
  },
  publicText: {
    fontWeight: 500,
    fontSize: '1.2rem',
  },
}));

const ResetPassword = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [profile, setProfile] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState({
    message: {
      message: '',
      type: 'info',
    },
  });

  let { id } = useParams();

  const getProfile = async () => {
    try {
      const response = await axios.get(
        `http://ec2-54-234-36-236.compute-1.amazonaws.com/publicProfile/${id}`
      );

      setArticles(response.data.articles);
      setProfile(response.data.profile);
      setLoading(false);
    } catch (err) {
      console.log('Failed:', err);
      setAlert({
        message: {
          message: err.response.data.response,
          type: 'error',
        },
      });
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    getProfile();
  }, [id]);

  // we want to fetch his saved articles
  // we want to fetch his profile data

  return (
    <Container>
      <Box className={classes.postsContainer}>
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
        {alert.message.type !== 'error' ? (
          <Grid
            style={{ marginTop: '3rem' }}
            spacing={2}
            container
            justify="center"
            className={'profileWrapper'}
          >
            <Grid item xs={12} sm={6}>
              {!loading ? (
                articles.length > 0 ? (
                  articles.map((article, index) => {
                    article.source = { name: article.source };
                    article.urlToImage = article.image_url;
                    article.url = article.article_url;
                    article.publishedAt = article.published_at;
                    return (
                      <Article
                        key={'news-' + index}
                        article={article}
                        private={true}
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
            <Grid item xs={12} sm={6}>
              <Card className={'articleCard'} variant="outlined">
                <h2>Profile</h2>
                <br />
                <Grid
                  className={classes.profileForm}
                  container
                  alignItems="center"
                >
                  <Grid item xs={6}>
                    <h3 className={classes.publicText}>
                      {'First name: ' + profile.firstName}
                    </h3>

                    <h3 className={classes.publicText}>
                      {'Last name: ' + profile.lastName}
                    </h3>

                    <h3 className={classes.publicText}>
                      {'Email: ' + profile.username}
                    </h3>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container justify="center" alignItems="center">
                      <img
                        className={classes.profileImage}
                        src={
                          'http://ec2-54-234-36-236.compute-1.amazonaws.com' +
                          profile.imageUrl
                        }
                        alt="logo"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <br />
                <br />
              </Card>
            </Grid>
          </Grid>
        ) : (
          ''
        )}
      </Box>
    </Container>
  );
};

export default ResetPassword;
