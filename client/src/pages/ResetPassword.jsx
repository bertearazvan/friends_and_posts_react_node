import React, { useState } from 'react';
import { Box, Button, Grid, TextField } from '@material-ui/core';
import Alert from '../components/Alert';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  alertBox: {
    position: 'absolute',
    marginTop: '2rem',
  },
  formWidth: {
    width: '40vw',
    maxWidth: '500px',
  },
}));

const ResetPassword = () => {
  const classes = useStyles();
  const [form, setForm] = useState({
    email: '',
    message: { message: '', type: 'info' },
  });
  const [openAlert, setOpenAlert] = useState(false);

  // if (localStorage.getItem('user')) {
  //   history.push('/dashboard');
  // }

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const onReset = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(
        'http://localhost:8080/users/resetPassword',
        {
          username: form.email,
        }
      );

      let data = response.data;
      setForm({
        email: '',
        message: {
          message: data.message,
          type: 'success',
        },
      });
      setOpenAlert(true);
      console.log('Success:', data.message);
    } catch (err) {
      console.log('Failed:', err.response.data.message);
      setForm({
        message: {
          message: err.response.data.message,
          type: 'error',
        },
        email: '',
      });
      setOpenAlert(true);
    }
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
        style={{ height: '60vh' }}
      >
        <Box>
          <h2>Forgot your password?</h2>
          <br />

          <Box className={classes.formWidth}>
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
                  onClick={onReset}
                >
                  Reset password
                </Button>
                <br />
              </Grid>
            </form>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default ResetPassword;
