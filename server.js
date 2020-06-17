// Packages
const express = require('express');

// Files
const config = require('./config');

// Init express
const app = express();

// Start express
app.listen(config.express.port, () => console.log('APP Running!'));
