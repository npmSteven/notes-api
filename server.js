// Packages
const express = require('express');
const exphbs = require('express-handlebars');
const cookieSession = require('cookie-session');

// Files
const config = require('./config');
const db = require('./db');
const authRoute = require('./routes/api/auth');
const passport = require('passport');

// Init express
const app = express();

// MW - parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Session
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [ config.cookie.key ]
}));

// MW - passport
app.use(passport.initialize());
app.use(passport.session());

// Set template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Set static files
app.use('/assets', express.static('assets'));

// Routes
app.use('/auth', authRoute);

app.get('/', (req, res) => {
  res.status(200).render('index');
});

// Run app
init();

async function init() {
  await db.connect();

  // Setup Models
  const User = require('./Models/User');

  // Setup passport
  require('./passport');

  // Start express
  app.listen(config.express.port, () => console.log('APP Running!'));
}
