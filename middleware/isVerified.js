const { sanitiseUser } = require('../common/user');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      payload: { message: 'Unauthorized' },
    });
  }
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, payload: { message: 'Cannot find account' } });
  }
  if (user.isVerified) {
    next();
  }
  return res
    .status(401)
    .json({ success: false, payload: { message: 'Not verified' } });
};
