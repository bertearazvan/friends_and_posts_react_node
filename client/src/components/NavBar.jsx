import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Toolbar,
  IconButton,
  Typography,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import PostAddIcon from '@material-ui/icons/PostAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import MenuIcon from '@material-ui/icons/Menu';
import BookmarksRoundedIcon from '@material-ui/icons/BookmarksRounded';
import ContactMailRoundedIcon from '@material-ui/icons/ContactMailRounded';
import LibraryBooksRoundedIcon from '@material-ui/icons/LibraryBooksRounded';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    backgroundColor: 'white',
    position: 'fixed',
    width: '100%',
    zIndex: 100,
  },
}));

export default function NavBar(props) {
  const classes = useStyles();
  let user = props.userData;

  const [open, setOpen] = useState(false);
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  const onSignOut = async () => {
    localStorage.removeItem('user');
    props.onAuth(false);
    try {
      await axios.get('http://ec2-54-234-36-236.compute-1.amazonaws.com/users/signout');
      setOpen(false);
      return;
    } catch (err) {
      return;
    }
  };

  return (
    <div className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Posts with friends
        </Typography>
      </Toolbar>
      <SwipeableDrawer
        anchor={'left'}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {props.isAuth ? (
          <List>
            <ListItem
              button
              component={Link}
              to="/profile"
              onClick={() => setOpen(false)}
            >
              <ListItemIcon>
                <ContactMailRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={user ? user.first_name : 'default'} />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/savedArticles"
              onClick={() => setOpen(false)}
            >
              <ListItemIcon>
                <BookmarksRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={'Saved articles'} />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/news"
              onClick={() => setOpen(false)}
            >
              <ListItemIcon>
                <LibraryBooksRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={'News'} />
            </ListItem>

            <ListItem button component={Link} to="/" onClick={onSignOut}>
              <ListItemIcon>
                <ExitToAppRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={'Sign out'} />
            </ListItem>
          </List>
        ) : (
            <List>
              <ListItem
                button
                component={Link}
                to="/"
                onClick={() => setOpen(false)}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary={'Login'} />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/signup"
                onClick={() => setOpen(false)}
              >
                <ListItemIcon>
                  <PostAddIcon />
                </ListItemIcon>
                <ListItemText primary={'Sign up'} />
              </ListItem>
            </List>
          )}
      </SwipeableDrawer>
    </div>
  );
}
