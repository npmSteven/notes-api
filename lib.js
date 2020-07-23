const User = require('./models/User');

module.exports = {
  validateUser: async (req, res, next) => {
    try {
      // Check if the user who is authed exists in the database
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          errors: [
            { msg: 'User doesn not exist' },
          ],
        });
      }
      return next();
    } catch (error) {
      console.error('ERROR - lib.js - validateUser(): ', error);
      return res.status(500).json({
        success: false,
        errors: [
          { msg: 'Internal server error' },
        ],
      });
    }
  },
  getUser: (user) => {
    const {
      id,
      username,
      email,
      createdAt,
      updatedAt,
    } = user;
    return {
      id,
      username,
      email,
      createdAt,
      updatedAt,
    };
  },
};
