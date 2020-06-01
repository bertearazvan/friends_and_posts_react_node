import React from 'react';
import { Card, Grid, Box, Typography, Button } from '@material-ui/core';
import Save from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

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

const Article = (props) => {
  const [article] = useState(props.article);
  const classes = useStyles();

  return (
    <Card className={classes.card + ' articleItem'} variant="outlined">
      <Grid container style={{ padding: '1rem' }}>
        <Grid item xs={6}>
          <Grid container justify="flex-start">
            <Typography variant="h5" component="h2">
              {article.source.name || article.source}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container justify="flex-end" style={{ position: 'relative' }}>
            {!props.private ? (
              <Save
                className="saveIcon"
                onClick={() => props.onSaveArticle()}
              />
            ) : (
              ''
            )}

            {props.mine ? (
              <DeleteIcon
                className="deleteIcon"
                onClick={() => props.onDeleteArticle()}
              />
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      </Grid>

      <Typography
        style={{ padding: '0rem 1rem', marginBottom: '.5rem' }}
        component="p"
      >
        {article.title}
      </Typography>
      <Box>
        <img
          src={
            article.urlToImage ? article.urlToImage : '/images/placeholder.png'
          }
          className={classes.articleImage}
          alt={article.title}
        />
      </Box>
      <Box>
        <Typography
          className={classes.ownerName}
          color="textPrimary"
          style={{ padding: '1rem' }}
        >
          {article.description}
        </Typography>
      </Box>
      <Box>
        <Button
          style={{ margin: '0rem 1rem' }}
          color="primary"
          variant="contained"
          disableElevation
          href={article.url}
          target="_blank"
        >
          View article
        </Button>
      </Box>
      <Grid container style={{ padding: '0rem 1rem', marginTop: '.5rem' }}>
        <Grid item xs={6}>
          <Grid container justify="flex-start">
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              {moment(article.publishedAt).startOf('hour').fromNow()}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container justify="flex-end">
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              dangerouslySetInnerHTML={{ __html: article.author }}
            ></Typography>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Article;
