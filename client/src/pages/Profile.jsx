import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import FriendsBox from '../components/FriendsBox';
import ModalDialog from '../components/ModalDialog';
import {
  Container,
  Card,
  Grid,
  Box,
  Button,
  InputAdornment,
  TextField,
  IconButton,
} from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  card: {
    // position: 'relative',
    padding: '1rem',
    margin: '1rem',
  },
  textField: {
    padding: '.5rem',
    width: '95%',
  },
  profileForm: {
    gridTemplateColumns: '66fr 33fr',
  },
  alertBox: {
    position: 'fixed',
    zIndex: '10',
    marginTop: '3rem',
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    message: {
      message: '',
      type: 'info',
    },
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [image, setImage] = useState(null);
  const [form, setForm] = React.useState({
    firstName: props.userData.first_name,
    lastName: props.userData.last_name,
    username: props.userData.username,
    pictureUrl: 'http://localhost:8080' + props.userData.image_url,
    changed: false,
    profileImage: '',
  });
  // console.log(props.userData);

  // set form values
  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value, changed: true });
    if (prop === 'profileImage') {
      setImage(event.target.files[0]);
      setForm({
        ...form,
        pictureUrl: URL.createObjectURL(event.target.files[0]),
        changed: true,
      });
    }
  };

  const getRequests = async () => {
    try {
      const response = await axios.get(
        'http://ec2-54-234-36-236.compute-1.amazonaws.com/friends/pending',

      );
      const data = await response.data;
      // console.log('requests', data);

      setRequests(data);
      // return data;
    } catch (err) {
      // console.log('Failed:', err.response.data.message);
      setState({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
      });
      setOpenAlert(true);
    }
  };

  const acceptRequest = async (id) => {
    try {
      const response = await axios.put(
        `http://ec2-54-234-36-236.compute-1.amazonaws.com/friends/accept/${id}`,

      );
      const data = await response.data;
      // console.log('accept request', data.message);
      setState({
        message: {
          message: data.message,
          type: 'success',
        },
      });
      setOpenAlert(true);
      setRequests(requests.filter((request) => request.id !== id));
    } catch (err) {
      console.log('Failed:', err.response.data.message);
      setState({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
      });
      setOpenAlert(true);
    }
  };

  const declineRequest = async (id) => {
    try {
      const response = await axios.put(
        `http://ec2-54-234-36-236.compute-1.amazonaws.com/friends/reject/${id}`,

      );
      const data = await response.data;
      // console.log('reject request', data.message);
      setState({
        message: {
          message: data.message,
          type: 'success',
        },
      });
      setOpenAlert(true);
      setRequests(requests.filter((request) => request.id !== id));
    } catch (err) {
      console.log('Failed:', err.response.data.message);
      setState({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
      });
      setOpenAlert(true);
    }
  };

  const getFriends = async () => {
    try {
      const response = await axios.get('http://ec2-54-234-36-236.compute-1.amazonaws.com/friends');
      const data = response.data;
      setFriends(data);
      // return data;
    } catch (err) {
      console.log('Failed:', err.response.data.message);
      setState({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
      });
      setOpenAlert(true);
    }
  };

  const addFriend = async (username) => {
    try {
      const response = await axios.put(
        `http://ec2-54-234-36-236.compute-1.amazonaws.com/friends/request/${username}`
      );
      const data = response.data;
      // console.log('add friend', data);
      setState({
        message: {
          message: data.message,
          type: 'success',
        },
      });
      setOpenAlert(true);

      return data;
    } catch (err) {
      console.log('Failed:', err.response);
      setState({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
      });
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    getFriends();
    getRequests();

    const interval = setInterval(function () {
      getRequests();
      getFriends();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onAddFriend = (data) => {
    addFriend(data).then(() => getFriends());
  };

  const onRemoveFriend = (data) => {
    declineRequest(data).then(() => getFriends());
  };

  const onAcceptRequest = (data) => {
    acceptRequest(data).then(() => getFriends());
  };

  const onDeleteProfile = async () => {
    try {
      await axios.delete(`http://ec2-54-234-36-236.compute-1.amazonaws.com/users`);

      localStorage.removeItem('user');
      history.push('/');
    } catch (err) {
      console.log('Failed:', err);
      setState({
        message: {
          message: err.response.data.response,
          type: 'error',
        },
      });
      setOpenAlert(true);
    }
  };

  const onUpdateProfile = async () => {
    let data = new FormData();
    if (image) {
      data.append('file', image);
    }
    data.append('firstName', form.firstName);
    data.append('lastName', form.lastName);
    data.append('username', form.username);

    try {
      const response = await axios.put(`http://ec2-54-234-36-236.compute-1.amazonaws.com/users`, data);

      // console.log('newUser', response.data.response);

      setState({
        message: {
          message: 'Profile successfully updated.',
          type: 'success',
        },
      });
      setOpenAlert(true);
      localStorage.setItem('user', JSON.stringify(response.data.response));
      // console.log(data);
      // return data;
    } catch (err) {
      console.log('Failed:', err);
      setState({
        message: {
          message: err.response.data.response,
          type: 'error',
        },
      });
      setOpenAlert(true);
    }
  };

  return (
    <Container>
      <br />
      {openModal ? (
        <ModalDialog
          open={openModal}
          deleteAction={onDeleteProfile}
          onClose={() => setOpenModal(false)}
        />
      ) : (
          ''
        )}
      <Box>
        <Grid container direction="row" justify="center" alignItems="center">
          <Box className={classes.alertBox}>
            <br />
            <Alert
              open={openAlert}
              className={classes.alert}
              onClose={() => setOpenAlert(false)}
              severity={state.message.type}
            >
              {state.message.message}
            </Alert>
          </Box>
        </Grid>
        <Grid container justify="center" alignItems="flex-start" spacing={6}>
          <Grid item md={6}>
            <Grid container>
              <Grid container>
                {requests.length > 0 ? (
                  <React.Fragment>
                    {requests.map((request, index) => {
                      return (
                        <Alert
                          key={'alert-' + index}
                          style={{ marginTop: '1rem' }}
                          severity="info"
                          open={true}
                          onClose={() => setOpenAlert(false)}
                        >
                          You got a friend request from
                          <b>
                            {' ' + request.first_name + ' ' + request.last_name}
                          </b>
                          <br />
                          <Grid container justify="center">
                            <Button
                              className={classes.buttonFriendRequest}
                              variant="contained"
                              color="primary"
                              onClick={() => onAcceptRequest(request.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              className={classes.buttonFriendRequest}
                              variant="contained"
                              color="secondary"
                              onClick={() => declineRequest(request.id)}
                            >
                              Decline
                            </Button>
                          </Grid>
                        </Alert>
                      );
                    }, '')}
                  </React.Fragment>
                ) : (
                    ''
                  )}
                <FriendsBox
                  onAdd={onAddFriend}
                  friends={friends}
                  onDeleteFriend={onRemoveFriend}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6}>
            <Card className={classes.card} variant="outlined">
              <h2>Profile</h2>
              <br />
              <Grid
                className={classes.profileForm}
                container
                alignItems="center"
              >
                <Grid item xs={9}>
                  <TextField
                    label=""
                    className={classes.textField}
                    value={form.firstName}
                    onChange={handleChange('firstName')}
                    id="standard-start-adornment"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          First name
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  <TextField
                    className={classes.textField}
                    label=""
                    value={form.lastName}
                    onChange={handleChange('lastName')}
                    id="standard-start-adornment"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          Last name
                        </InputAdornment>
                      ),
                    }}
                  />
                  <br />
                  <TextField
                    className={classes.textField}
                    label=""
                    value={form.username}
                    onChange={handleChange('username')}
                    id="standard-start-adornment"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Email</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Grid container justify="center" alignItems="center">
                    <img
                      className={'profileImage'}
                      src={form.pictureUrl}
                      alt="logo"
                    />

                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="icon-button-file"
                      onChange={handleChange('profileImage')}
                      type="file"
                    />

                    <label htmlFor="icon-button-file">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <Grid container>
                    <Button
                      style={{ marginLeft: '1rem' }}
                      variant="contained"
                      color="primary"
                      disabled={!form.changed}
                      onClick={() => onUpdateProfile()}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container justify="flex-end">
                    <Button
                      onClick={() => setOpenModal(true)}
                      variant="outlined"
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile;
