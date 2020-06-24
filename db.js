const { Sequelize } = require('sequelize');

const { db } = require('./config');

const sequelize = new Sequelize(db.url);

module.exports.connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
  } catch(error) {
    console.error('Failed to connect to DB', error);
    process.exit(1);
  }
};

module.exports.sequelize = () => sequelize;
