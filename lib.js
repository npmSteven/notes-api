const crypto = require('crypto');

const User = require('./models/User');

module.exports = {
  validateUser: async (req, res, next) => {
    try {
      // Check if the user who is authed exists in the database
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          payload: { message: 'User does not exist' },
        });
      }
      return next();
    } catch (err) {
      console.error('ERROR - lib.js - validateUser(): ', err);
      return res.status(500).json({
        success: false,
        payload: { message: 'Internal server error' },
      });
    }
  },
  getCurrentDate: () => new Date().toISOString(),
  paginate: ({ page = 0, pageSize = 10 }) => {
    const offset = page * pageSize;
    const limit = pageSize;
    return {
      offset,
      limit,
    };
  },
  generateToken: () => crypto.randomBytes(16).toString('hex'),
  toTimestamp: (iso) => new Date(iso).getTime(),
};
