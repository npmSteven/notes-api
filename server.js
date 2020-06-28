// Packages
const express = require('express');

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

// Routes
app.use('/api/auth', authApiRoutes);
app.use('/api/note', noteApiRoutes);

// Run app
init();

async function init() {
  try {
    // Attempt a database connection
    await db.connect();

    // Start express
    app.listen(config.express.port, () => console.log('APP Running!'));
  } catch (error) {
    console.log('ERROR - Failed init(): ', error);
  }
}
