// Packages
const express = require('express');
const uuid = require('uuid');

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

// MW - passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoute);

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
