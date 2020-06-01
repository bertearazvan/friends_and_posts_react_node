import React, { useEffect } from 'react';
import './App.css';
import { } from '@material-ui/core';
import NavBar from './components/NavBar';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordForm from './pages/ResetPasswordForm';
import News from './pages/News';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import SavedArticles from './pages/SavedArticles';

import axios from 'axios';
axios.defaults.withCredentials = true;

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  const history = useHistory();

  // check if the user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          'http://ec2-54-234-36-236.compute-1.amazonaws.com/users/session'
        );
        const data = response.data;
        // console.log(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        // localStorage.removeItem('user');
      } catch (err) {
        localStorage.removeItem('user');
        history.push('/');
        return;
      }
    };

    checkSession();
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        auth === true || localStorage.getItem('user') ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/',
                state: { from: props.location },
              }}
            />
          )
      }
    />
  );
};

const App = () => {
  const [auth, setAuth] = React.useState(
    localStorage.getItem('user') ? true : false
  );

  const [userData, setUserData] = React.useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ''
  );

  //fetch setAuth(true)

  return (
    <div>
      <NavBar
        userData={userData}
        isAuth={auth}
        onAuth={(data) => setAuth(data)}
      />
      <br />
      <br />
      <Switch>
        <Route
          exact
          path="/"
          component={(props) => (
            <Login
              {...props}
              onAuth={(data) => setAuth(data)}
              userData={(data) => setUserData(data)}
            />
          )}
        ></Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/reset">
          <ResetPassword />
        </Route>
        <Route
          exact
          path="/resetForm/:token"
          component={(props) => <ResetPasswordForm {...props} />}
        />
        <PrivateRoute
          auth={auth}
          exact
          path="/news"
          component={(props) => <News {...props} />}
        />
        <PrivateRoute
          auth={auth}
          exact
          path="/savedArticles"
          component={(props) => <SavedArticles {...props} />}
        />
        <PrivateRoute
          auth={auth}
          exact
          path="/profile"
          component={(props) => <Profile userData={userData} {...props} />}
        />
        <PrivateRoute
          auth={auth}
          exact
          path="/profile/:id"
          component={(props) => <PublicProfile {...props} />}
        />
      </Switch>
    </div>
  );
};

export default App;
