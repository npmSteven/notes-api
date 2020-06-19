const { Sequelize } = require('sequelize');

const { db: { username, password, host, database } } = require('./config');

let sequelize = null;

module.exports.connect = async () => {
  sequelize = new Sequelize({ 
    dialect: 'postgres',
    host,
    port: 5433,
    database,
    password,
    username
  });
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
  } catch(error) {
    console.error('Failed to connect to DB', error);
    process.exit(1);
  }
};

module.exports.sequelize = () => sequelize;
