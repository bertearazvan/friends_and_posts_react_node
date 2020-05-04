import React from 'react';

import { Container, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    padding: '1rem',
    margin: '1rem',
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  console.log(props.userData);
  return (
    <Container>
      <br />
      <Card className={classes.card} variant="outlined">
        <h2>Profile</h2>
        <br />
        <p>
          Name: {props.userData.first_name + ' ' + props.userData.last_name}
        </p>
        <br />
        <p>Username: {props.userData.username}</p>
      </Card>
    </Container>
  );
};

export default Profile;
