// Packages
const dotenv = require('dotenv');

// Initialse dotenv so we can get the enviroment variables from .env file
dotenv.config();

module.exports = {
  db: {
    url: process.env.DATABASE_URL
  },
  express: {
    port: process.env.PORT || 8080
  },
  cookie: {
    key: 'djakshdklasjdlksajdlkdsalkjdklasd'
  }
};
