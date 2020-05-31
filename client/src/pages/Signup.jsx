import React, { useState } from 'react';
import { Box, Button, Grid, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Alert from '../components/Alert';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  alertBox: {
    position: 'absolute',
    marginTop: '2rem',
  },
  formContainer: {
    height: '65vh',
    padding: '0px 1rem',
  },
}));

const Signup = () => {
  const classes = useStyles();
  const history = useHistory();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    message: {
      message: '',
      type: 'info',
    },
  });
  const [openAlert, setOpenAlert] = useState(false);

  if (localStorage.getItem('user')) {
    history.push('/posts');
  }

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const onSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/users/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        repeatPassword: form.repeatPassword,
        username: form.email,
        password: form.password,
      });

      setForm({
        message: {
          message: 'The user has been created',
          type: 'success',
        },
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        repeatPassword: '',
      });
      setOpenAlert(true);
      // console.log('Success:', data);
    } catch (err) {
      console.log('Failed:', err.response.data.message);
      setForm({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        repeatPassword: '',
      });
      setOpenAlert(true);
    }
  };

  const onLogin = () => {
    history.push('/');
  };

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
        className={classes.formContainer}
      >
        <Box>
          <br />
          <h2>Sign up</h2>
          <Box>
            <form id="dashboardLoginForm">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First name"
                    name="firstName"
                    autoFocus
                    value={form.firstName}
                    onChange={handleChange('firstName')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange('lastName')}
                  />
                </Grid>
              </Grid>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange('email')}
              />
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={form.password}
                    onChange={handleChange('password')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="repeatPassword"
                    label="Repeat password"
                    type="password"
                    id="repeatPassword"
                    value={form.repeatPassword}
                    onChange={handleChange('repeatPassword')}
                  />
                </Grid>
              </Grid>

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
                  onClick={onSignup}
                >
                  Sign up
                </Button>
                <br />
                <Button
                  fullWidth
                  variant="contained"
                  color="default"
                  onClick={onLogin}
                >
                  Login
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

export default Signup;
