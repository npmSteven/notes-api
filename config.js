// Packages
const dotenv = require('dotenv');

// Initialse dotenv so we can get the enviroment variables from .env file
dotenv.config();

module.exports = {
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
  express: {
    port: process.env.PORT || 8080
  }
};
