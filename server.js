// Packages
const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const cookieSession = require('cookie-session');

// Files
const config = require('./config');
const db = require('./db');

const authApiRoutes = require('./routes/api/auth');
const noteApiRoutes = require('./routes/api/note');

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

// Routes
// API
app.use('/api/auth', authApiRoutes);
app.use('/api/note', noteApiRoutes);

// Run app
init();

async function init() {
  try {
    // Attempt a database connection
    await db.connect();

    // Setup passport
    require('./passport');
  
    // Start express
    app.listen(config.express.port, () => console.log('APP Running!'));
  } catch {
    console.log('ERROR - Failed init(): ', error);
  }
}
