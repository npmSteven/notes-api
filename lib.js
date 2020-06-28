const User = require('./models/User');

module.exports = {
    validateUser: (req, res, next) => {
      // Check if the user is authed
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
      }
      // Check if the user who is authed exists in the database
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, errors: [ { msg: `User doesn't exist` } ] });
      }
      return next();
    }
}