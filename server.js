// Packages
const express = require('express');

// Files
const config = require('./config');
const db = require('./db');

// Init express
const app = express();

// Run app
init();

async function init() {
  await db.connect();

  // Start express
  app.listen(config.express.port, () => console.log('APP Running!'));
}
