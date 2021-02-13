const { Sequelize } = require('sequelize');

const { db } = require('./config');

// Set the credentials of the database and options to connect
const sequelize = new Sequelize(db.url, {
  protocol: 'postgres',
  logging: false,
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

const User = require('./models/User');
const Note = require('./models/Note');
const AccountVerificationToken = require('./models/AccountVerificationToken');

module.exports.syncModels = async () => {
  try {
    await User.sync();
    await Note.sync();
    await AccountVerificationToken.sync();
  } catch (error) {
    throw error;
  }
};

module.exports.sequelize = sequelize;
