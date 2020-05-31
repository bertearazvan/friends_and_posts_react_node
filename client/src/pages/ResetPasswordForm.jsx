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

const ResetPasswordForm = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [form, setForm] = useState({
    password: '',
    repeatPassword: '',
    message: { message: '', type: 'info' },
  });
  const [openAlert, setOpenAlert] = useState(false);

  // if (localStorage.getItem('user')) {
  //   history.push('/dashboard');
  // }

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.put(
        'http://localhost:8080/users/confirmResetPassword',
        {
          token: props.match.params.token,
          password: form.password,
          confirmPassword: form.repeatPassword,
        }
      );

      let data = response.data;
      setForm({
        message: { message: data.message, type: 'success' },
        repeatPassword: '',
        password: '',
      });
      setOpenAlert(true);
      // console.log('Success:', data);
      //   history.push('/');
    } catch (err) {
      console.log('Failed:', err.response.data);
      setForm({
        repeatPassword: '',
        password: '',
        message: {
          message: err.response.data.message || err.response.data,
          type: 'error',
        },
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
      <Grid container direction="row" justify="center" alignItems="center">
        {form.confirmation ? (
          <Box className={classes.alertBox}>
            <br />
            <Alert severity="success">{form.confirmation}</Alert>
          </Box>
        ) : (
          ''
        )}
      </Grid>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.formContainer}
      >
        <Box>
          <h2>Reset password</h2>
          <Box>
            <form>
              <Grid>
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
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  name="repeatPassword"
                  label="Repeat password"
                  type="password"
                  id="repeatPassword"
                  value={form.repeatPassword}
                  onChange={handleChange('repeatPassword')}
                />
              </Grid>

              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <br />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onChangePassword}
                >
                  Reset password
                </Button>
                <br />
                {form.confirmation ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={onLogin}
                  >
                    Log in
                  </Button>
                ) : (
                  ''
                )}
              </Grid>
            </form>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default ResetPasswordForm;
