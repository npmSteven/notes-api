const { DataTypes } = require('sequelize');
const { sequelize } = require('../db')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerified: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}, { createdAt: false, updatedAt: false });

module.exports = User;
