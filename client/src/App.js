import React from 'react';
import './App.css';
import {} from '@material-ui/core';
import NavBar from './components/NavBar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordForm from './pages/ResetPasswordForm';
import Posts from './pages/Posts';
import Profile from './pages/Profile';

import axios from 'axios';
axios.defaults.withCredentials = true;

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
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

function App() {
  const [auth, setAuth] = React.useState(
    localStorage.getItem('user') ? true : false
  );

  const [userData, setUserData] = React.useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ''
  );

  return (
    <div>
      <Router>
        <NavBar
          userData={userData}
          isAuth={auth}
          onAuth={(data) => setAuth(data)}
        />

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
            path="/resetForm/:id"
            component={(props) => <ResetPasswordForm {...props} />}
          />
          <PrivateRoute
            auth={auth}
            exact
            path="/posts"
            component={(props) => <Posts {...props} />}
          />
          <PrivateRoute
            auth={auth}
            exact
            path="/profile"
            component={(props) => <Profile userData={userData} {...props} />}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
