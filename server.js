// Packages
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Files
const config = require('./config');
const db = require('./db');

const authApiRoutes = require('./routes/api/auth');
const noteApiRoutes = require('./routes/api/note');
const userApiRoutes = require('./routes/api/user');

// Init express
const app = express();

// Cors
app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests, wait a minute until you can query again',
});
app.use(limiter);

// MW - parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authApiRoutes);
app.use('/api/v1/note', noteApiRoutes);
app.use('/api/v1/user', userApiRoutes);

async function init() {
  try {
    // Attempt a database connection
    await db.connect();

    // Sync models
    await db.syncModels();

    // Start express
    app.listen(config.express.port, () => console.log('APP Running!'));
  } catch (err) {
    console.error('ERROR - Failed init(): ', err);
  }
}

// Run app
init();
