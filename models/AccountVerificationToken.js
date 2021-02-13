const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Token = sequelize.define('accountVerificationToken', {
  id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
  token: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  expires: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}, { createdAt: false, updatedAt: false });

module.exports = Token;
