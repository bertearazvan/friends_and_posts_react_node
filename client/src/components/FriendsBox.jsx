import React, { useState } from 'react';
import {
  Button,
  Grid,
  Card,
  Typography,
  IconButton,
  TextField,
  Box,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  friendsWidth: {
    width: '30vw',

    margin: '.1rem',
    marginTop: '1rem',
  },
  card: {
    width: '30vw',
    maxWidth: '350px',
    padding: '1rem',
    minWidth: '250px',
    position: 'fixed',
  },
  friendBox: {
    width: '50%',
  },
}));

const FriendsBox = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onAdd = () => {
    props.onAdd(value);
    setValue('');
  };

  const onDeleteFriend = (id) => {
    // console.log(id);
    props.onDeleteFriend(id);
  };

  return (
    <Grid className={classes.friendsWidth}>
      <Card className={classes.card} variant="outlined">
        <Box>
          <Typography variant="h5" component="h2">
            Friends
          </Typography>
          <br />

          {props.friends.length > 0 ? (
            <Grid container>
              {props.friends.map((friend, index) => {
                return (
                  <React.Fragment key={'friend-' + index}>
                    <Grid
                      className={classes.friendBox}
                      container
                      alignItems="center"
                    >
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        {friend.first_name + ' ' + friend.last_name}
                      </Typography>
                    </Grid>
                    <Grid
                      className={classes.friendBox}
                      container
                      alignItems="center"
                      justify="flex-end"
                    >
                      <IconButton
                        color="secondary"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => onDeleteFriend(friend.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
          ) : (
            <Box>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                You don't have a friend yet
              </Typography>
            </Box>
          )}

          <br />
          <hr />
          <br />
          <Grid container>
            <Grid
              container
              alignItems="center"
              justify="center"
              style={{ width: '70%' }}
            >
              <TextField
                value={value}
                id="standard-search"
                label="Search field"
                type="search"
                autoFocus
                onChange={onChange}
              />
            </Grid>
            <Grid
              container
              alignItems="center"
              justify="center"
              style={{ width: '30%' }}
            >
              <Button onClick={onAdd} color="primary" variant="contained">
                Add
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
};

export default FriendsBox;
