const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  // Check for token
  if (!token) return res.status(401).json({ success: false, message: 'No token, authorizaton denied' });

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    // Add user from payload
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Token is not valid' });
  }
};
