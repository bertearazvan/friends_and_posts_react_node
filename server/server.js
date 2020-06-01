const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const path = require("path");
const session = require('express-session');
//express init
const app = express();

// Formidable

// app.use(formidableMiddleware);
// Rate limiter

const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
});

// app.enable('trust proxy');
app.use(helmet());

// Middleware config
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // enable set cookie
  })
  // cors()
);

// app.options('*', cors());

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

app.use(
  session({
    secret: 'davis jonson',
    resave: false,
    saveUninitialized: true,
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
const newsRoute = require('./routes/news');
// set session variable to keep the same sessionID for the whole app

app.use('/users/login', authLimiter);
app.use(newsRoute);
app.use(friendsRoute);
app.use(usersRoute);

// General routes

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use("/", express.static(path.join(__dirname, "public")))

// Setup the database

const { Model } = require('objection');
const Knex = require('knex');
const knexFile = require('./knexfile.js');

const knex = Knex(knexFile.development);

//Give the knex instance to objection
Model.knex(knex);

// serve build



//Server running

const port = process.env.PORT || 80;

const server = app.listen(port, (err) => {
  if (err) {
    console.log('Server is down');
    return;
  }

  return console.log('Server is listening to port ', server.address().port, "...");
});
