const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  // Check for token
  if (!token) {
    return res.status(401).json({
      success: false,
      payload: { message: 'No token, authorizaton denied' },
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res
      .status(400)
      .json({ success: false, payload: { message: 'Token is not valid' } });
  }
};
