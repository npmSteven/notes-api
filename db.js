const { Sequelize } = require('sequelize');

const { db } = require('./config');

// Set the credentials of the database and options to connect
const sequelize = new Sequelize(db.url, {
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Authenticate to the database
module.exports.connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
  } catch (err) {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  }
};

// Return sequelize so that we can use it to create models and etc
module.exports.sequelize = () => sequelize;
