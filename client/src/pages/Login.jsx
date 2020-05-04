import React, { useState } from 'react';
import { Box, Button, Grid, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Alert from '../components/Alert';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

//set the styles for the Ui component
const useStyles = makeStyles((theme) => ({
  alertBox: {
    position: 'absolute',
    marginTop: '2rem',
  },
}));

// Login component
const Login = (props) => {
  // use the style for mat-UI
  const classes = useStyles();
  const history = useHistory();

  if (localStorage.getItem('user')) {
    history.push('/posts');
  }

  // set form state
  const [form, setForm] = React.useState({
    email: '',
    password: '',
    message: { message: '', type: 'info' },
  });

  const [openAlert, setOpenAlert] = useState(false);

  // for knowing where to redirect the user, if it got redirected to to not auth
  const from = props.location.state || { from: { pathname: '/posts' } };
  // localStorage.removeItem('user');

  // set form values
  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  // login function
  const onLogin = async (e) => {
    //do not refresh
    e.preventDefault();

    try {
      // try logging in to the backend
      let response = await axios.post('http://localhost:8080/users/login', {
        username: form.email,
        password: form.password,
      });

      //get the data from login - the user
      let data = response.data;

      // send the success message and prevent errors due to Material-UI textfield behaviour
      setForm({
        message: {
          message: 'You have been logged in!',
          type: 'success',
        },
        email: '',
        password: '',
      });

      setOpenAlert(true);

      // if auth then set auth to true and send it to the router
      props.onAuth(true);
      props.userData(data.response);
      localStorage.setItem('user', JSON.stringify(data.response));

      // push to the page you came from to login
      history.push(from.from.pathname);
    } catch (err) {
      console.log(err);
      console.log('Failed:', err.response.data.message || err.response);

      // send the error message and prevent errors due to Material-UI textfield behaviour
      setForm({
        message: {
          message: err.response.data.message || err.response.data,
          type: 'error',
        },
        email: '',
        password: '',
      });
      setOpenAlert(true);
    }
  };

  // console.log(props);

  return (
    <Box>
      <Grid container direction="row" justify="center" alignItems="center">
        <Box className={classes.alertBox}>
          <br />

          <Alert
            open={openAlert}
            onClose={() => setOpenAlert(false)}
            severity={form.message.type}
          >
            {form.message.message}
          </Alert>
        </Box>
      </Grid>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ height: '60vh' }}
      >
        <Box>
          <h2>Log in</h2>
          <Box>
            <form>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={form.email}
                onChange={handleChange('email')}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange('password')}
              />

              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <br />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={onLogin}
                >
                  Log in
                </Button>
                <br />
                <Button
                  fullWidth
                  variant="contained"
                  color="default"
                  onClick={() => history.push('/signup')}
                >
                  Sign up
                </Button>
                <br />
                <Button
                  fullWidth
                  variant="contained"
                  color="default"
                  onClick={() => history.push('/reset')}
                >
                  I forgot the password
                </Button>
              </Grid>
            </form>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Login;
