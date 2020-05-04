import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar(props) {
  const classes = useStyles();
  let user = props.userData;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Posts with friends
          </Typography>
          {props.isAuth ? (
            <Box>
              <Button color="inherit" component={Link} to="/profile">
                {user ? user.first_name : 'default'}
              </Button>
              <Button color="inherit" component={Link} to="/posts">
                Posts
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/"
                onClick={() => {
                  localStorage.removeItem('user');
                  props.onAuth(false);
                }}
              >
                Sign out
              </Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" component={Link} to="/">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
