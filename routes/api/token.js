const express = require('express');
const { DateTime } = require('luxon');
const { sanitiseUser } = require('../../common/user');
const { getCurrentDate, toTimestamp } = require('../../lib');
const Token = require('../../models/Token');
const User = require('../../models/User');

const tokenValidation = require('../../validation/tokenValidation');

const router = express.Router();

router.put('/confirm/:token', async (req, res) => {
  const { error, value } = tokenValidation.validate(req.params);
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }
  const { token } = value;
  try {
    const verificationToken = await Token.findOne({ where: { token } });
  
    if (!verificationToken) {
      return res
        .status(401)
        .json({ success: false, payload: { message: 'Invalid token' } });
    }
  
    const currentDate = toTimestamp(getCurrentDate());
    const expiryDate = toTimestamp(verificationToken.expires);
  
    if (currentDate >= expiryDate) {
      return res
        .status(401)
        .json({
          success: false,
          payload: { message: 'This token has expiered' },
        });
    }

    const user = await User.findByPk(verificationToken.userId);
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          payload: { message: 'This user does not exist' },
        });
    }

    const updatedUser = await user.update({
      isVerified: true,
    });

    await verificationToken.destroy();

    return res.status(200).json({
      success: true,
      payload: sanitiseUser(updatedUser),
    });
  } catch (err) {
    console.log('ERROR - token.js - / put confirm/:id: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

module.exports = router;
