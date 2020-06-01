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
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  friendsWidth: {
    width: '100%',
    height: '100%',
    // margin: '1rem',
  },
  card: {
    // width: '100%',
    // maxWidth: '350px',
    padding: '1rem',
    margin: '1rem',
    minWidth: '250px',
    // position: 'fixed',
  },
  friendBox: {
    width: '50%',
  },
}));

const FriendsBox = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const [value, setValue] = useState('');
  const [searchList, setSearchList] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axios.get(`http://ec2-54-234-36-236.compute-1.amazonaws.com/users`);

      // console.log(response.data.response);
      setSearchList(response.data.response);
    } catch (err) {
      console.log(err);
    }
  };
  const onAdd = () => {
    props.onAdd(value.username);
    setValue('');
  };

  const onDeleteFriend = (id) => {
    // console.log(id);
    props.onDeleteFriend(id);
  };

  const seeProfile = (id) => {
    history.push(`/profile/${id}`);
  };

  useEffect(() => {
    getUsers();
  }, []);

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
                        className={'friend'}
                        color="textSecondary"
                        gutterBottom
                        onClick={() => seeProfile(friend.id)}
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
              style={{ width: '70%', position: 'relative' }}
            >
              {/* <Autocomplete
                id="combo-box-demo"
                options={searchList}
                getOptionLabel={(option) => option.title}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Combo box" variant="outlined" />
                )}
              /> */}
              <Autocomplete
                id="combo-box-demo"
                value={value}
                fullWidth
                options={searchList}
                getOptionLabel={(option) => option.username}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="standard-search"
                    label="Search by email"
                    type="search"
                  />
                )}
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
