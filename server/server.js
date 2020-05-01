const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//express init
const app = express();

// Middleware config
app.set('trust proxy', 1);
app.use(cors());
app.use(cookieParser('davis jonson'));
app.use(
  session({
    secret: 'davis jonson',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// Routes

const usersRoute = require('./routes/users');
const friendsRoute = require('./routes/friends');
const postsRoute = require('./routes/posts');
// set session variable to keep the same sessionID for the whole app
let sess;
app.use('/', (req, res, next) => {
  sess = req.session;
  next();
});

app.use(usersRoute);
app.use(postsRoute);
app.use(friendsRoute);

// Setup the database

const { Model } = require('objection');
const Knex = require('knex');
const knexFile = require('./knexfile.js');

const knex = Knex(knexFile.development);

//Give the knex instance to objection
Model.knex(knex);

//Server running

const port = process.env.PORT || 8080;

const server = app.listen(port, (err) => {
  if (err) {
    console.log('Server is down');
    return;
  }

  return console.log('Server is listening to port', server.address().port);
});
