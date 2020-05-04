const express = require('express');
const cors = require('cors');
const session = require('express-session');
//express init
const app = express();

// Rate limiter

const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
});

// Middleware config
app.use(
  cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // enable set cookie
  })
);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(
  session({
    secret: 'davis jonson',
    resave: false,
    saveUninitialized: true,
  })
);

// Routes

const usersRoute = require('./routes/users');
const friendsRoute = require('./routes/friends');
const postsRoute = require('./routes/posts');
// set session variable to keep the same sessionID for the whole app

app.use('/users/login', authLimiter);
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
