const { Sequelize } = require('sequelize');

const { db: { username, password, host, database } } = require('./config');

module.exports.connect = async () => {
  const sequelize = new Sequelize({ 
    dialect: 'postgres',
    host,
    port: 5432,
    ssl: true,
    database,
    password,
    username,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  });
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
  } catch(error) {
    console.error('Failed to connect to DB', error);
    process.exit(1);
  }
};

