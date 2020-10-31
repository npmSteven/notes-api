const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization');
  // Check for token
  if (!token) {
    return res.status(401).json({
      success: false,
      payload: { message: 'No token, authorization denied' },
    });
  }

  // Verify token
  const decoded = jwt.verify(token, config.jwt.secret);

  try {
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        payload: { message: 'User does not exist' },
      });
    }

    // Add user from payload
    req.user = decoded;

    next();
  } catch (err) {
    console.log('ERROR - auth.js - / auth', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
};
