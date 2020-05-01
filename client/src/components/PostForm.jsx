import React from 'react';

import { Grid, Card, TextField, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

//set the styles for the Ui component
const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
  },
  card: {
    position: 'relative',
    padding: '1rem',
    margin: '1rem',
  },
}));

const PostForm = (props) => {
  const classes = useStyles();
  const [postForm, setPostForm] = React.useState({
    post_title: '',
    post_body: '',
  });

  // set form values
  const handleChange = (prop) => (event) => {
    setPostForm({ ...postForm, [prop]: event.target.value });
  };

  const onAddPost = (e) => {
    e.preventDefault();
    props.onAddPost(postForm);
    setPostForm({ post_title: '', post_body: '' });
  };

  return (
    <Card className={classes.card}>
      <Typography variant="h5" component="h2">
        Add a post
      </Typography>
      <form className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          inputProps={{
            maxLength: 75,
          }}
          id="post_title"
          label="Post title"
          name="post_title"
          autoFocus
          value={postForm.post_title}
          onChange={handleChange('post_title')}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          multiline
          rows={4}
          inputProps={{
            maxLength: 500,
          }}
          fullWidth
          id="post_body"
          label="Content"
          name="post_body"
          value={postForm.post_body}
          onChange={handleChange('post_body')}
        />
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <br />
          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={onAddPost}
          >
            Add post
          </Button>
        </Grid>
      </form>
    </Card>
  );
};

export default PostForm;
