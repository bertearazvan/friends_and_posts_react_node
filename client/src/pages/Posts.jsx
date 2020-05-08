import React, { useState, useEffect } from 'react';
import { Box, Grid, Button } from '@material-ui/core';
import Alert from '../components/Alert';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import FriendsBox from '../components/FriendsBox';
import PostsBox from '../components/PostsBox';

const useStyles = makeStyles((theme) => ({
  alertBox: {
    position: 'absolute',
    zIndex: '10',
  },
  buttonFriendRequest: {
    margin: '1rem',
  },
  postsContainer: {
    marginTop: '2rem',
  },
}));

const Posts = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    message: {
      message: '',
      type: 'info',
    },
  });
  const [openAlert, setOpenAlert] = useState(false);

  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  let user = '';
  if (localStorage.getItem('user')) {
    user = JSON.parse(localStorage.getItem('user'));
  }

  const getPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/posts');
      const data = response.data;

      // return data;
      setPosts(data);
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

  const getRequests = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/friends/pending',
        { credentials: 'same-origin' }
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
        `http://localhost:8080/friends/accept/${id}`,
        { credentials: 'same-origin' }
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
        `http://localhost:8080/friends/reject/${id}`,
        { credentials: 'same-origin' }
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
      const response = await axios.get('http://localhost:8080/friends', {
        credentials: 'same-origin',
      });
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
        `http://localhost:8080/friends/request/${username}`,
        { credentials: 'same-origin' }
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

  const addPost = async (post) => {
    try {
      const response = await axios.post(`http://localhost:8080/posts`, {
        credentials: 'same-origin',
        post_title: post.post_title,
        post_body: post.post_body,
      });
      const data = await response.data;
      // console.log('add post', data);
      setState({
        message: {
          message: data.message,
          type: 'success',
        },
      });
      setOpenAlert(true);
      setPosts(data);
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

  const onAddPost = (data) => {
    // console.log(data);
    // console.log(user.id);
    addPost(data).then(() => getPosts());
  };

  useEffect(() => {
    getPosts();
    getFriends();
    getRequests();
    // getFriends().then((res) => setFriends(res));
    // getRequests().then((res) => setRequests(res));

    const interval = setInterval(function () {
      getRequests();
      getPosts();
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

  // console.log('friends', friends);
  // TODO: add a message.show
  if (user) {
    return (
      <Box className={classes.postsContainer}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Box className={classes.alertBox}>
            <br />
            <Alert
              open={openAlert}
              onClose={() => setOpenAlert(false)}
              severity={state.message.type}
            >
              {state.message.message}
            </Alert>
          </Box>
        </Grid>
        <Grid style={{ marginTop: '3rem' }} container justify="center">
          <Grid>
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
                      You got a friend request from{' '}
                      <b>{request.first_name + ' ' + request.last_name}</b>
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
          <Grid>
            <PostsBox onAddPost={(data) => onAddPost(data)} posts={posts} />
          </Grid>
        </Grid>
      </Box>
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

export default Posts;
