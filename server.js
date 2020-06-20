// Packages
const express = require('express');
const exphbs = require('express-handlebars');

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

// Set template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

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
