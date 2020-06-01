import React from 'react';
import { Box, Grid, Card, Typography } from '@material-ui/core';
import PostForm from './PostForm';
import DotLoader from 'react-spinners/DotLoader';

import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment/moment';

const useStyles = makeStyles((theme) => ({
  postsWidth: {
    width: '45vw',
    maxWidth: '600px',
  },
  card: {
    position: 'relative',
    padding: '1rem',
    margin: '1rem',
  },
  cardTime: {
    position: 'absolute',
    right: '1rem',
  },
  ownerName: {
    position: 'absolute',
    right: '1rem',
    bottom: '0',
    fontSize: '14px',
  },
}));

const PostsBox = (props) => {
  const classes = useStyles();

  return (
    <Grid className={classes.postsWidth} item>
      <PostForm onAddPost={(data) => props.onAddPost(data)} />
      {props.posts.length > 0 ? (
        <React.Fragment>
          {props.posts.map((post, index) => {
            return (
              <Card
                key={'post-' + index}
                className={classes.card}
                variant="outlined"
              >
                <Box className={classes.cardTime}>
                  <Typography
                    style={{ fontSize: '12px' }}
                    color="textSecondary"
                    gutterBottom
                  >
                    {moment(post.created_at).startOf('hour').fromNow()}
                  </Typography>
                </Box>
                <br />
                <Typography variant="h5" component="h2">
                  {post.post_title}
                </Typography>
                <Typography
                  className={classes.ownerName}
                  color="textSecondary"
                  gutterBottom
                >
                  {post.first_name + ' ' + post.last_name}
                </Typography>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {post.post_body}
                </Typography>
              </Card>
            );
          })}
        </React.Fragment>
      ) : (
        <Grid container justify="center">
          <br />
          <DotLoader color="#3f51b5" />
        </Grid>
      )}
    </Grid>
  );
};

export default PostsBox;
