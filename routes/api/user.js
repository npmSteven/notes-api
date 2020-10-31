const express = require('express');
const uuid = require('uuid');

const { deleteNotes } = require('../../common/note');
const { sanitiseUser } = require('../../common/user');
const { getCurrentDate, hasExpired, generateToken } = require('../../lib');
const auth = require('../../middleware/auth');
const Note = require('../../models/Note');
const User = require('../../models/User');
const tokenValidation = require('../../validation/tokenValidation');
const { userUpdateValidation } = require('../../validation/userValidation');
const AccountVerificationToken = require('../../models/AccountVerificationToken');
const { DateTime } = require('luxon');
const { sendMail } = require('../../mail');

const router = express.Router();

/**
 * Get a user's details
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    return res.json({
      success: true,
      payload: sanitiseUser(user),
    });
  } catch (err) {
    console.error('ERROR - user.js - get - user: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

// User delete
router.delete('/', auth, async (req, res) => {
  try {
    const notes = await Note.findAll({ where: { userId: req.user.id } });

    const noteIds = notes.map(({ id }) => id);

    if (noteIds.length >= 1) {
      const hasDeletedNotes = await deleteNotes(noteIds, req.user.id);
      if (!hasDeletedNotes) {
        return res.status(500).json({
          success: false,
          payload: { message: 'Server error: failed to delete notes' },
        });
      }
    }

    const user = await User.findOne({ where: { id: req.user.id } });

    await user.destroy();

    return res.status(200).json({ success: true, payload: sanitiseUser(user) });
  } catch (err) {
    console.error('ERROR - user.js - delete - user: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

// Update user
router.put('/', auth, async (req, res) => {
  const { error, value } = userUpdateValidation.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }
  const { firstName, lastName, email } = value;
  try {
    const userEmail = await User.findOne({ where: { email } });

    if (userEmail && userEmail.id !== req.user.id) {
      return res.status(400).json({
        success: false,
        payload: { message: 'User already exists' },
      });
    }

    const user = await User.findByPk(req.user.id);

    const updatedUser = await user.update({
      firstName,
      lastName,
      email,
      updatedAt: getCurrentDate(),
    });

    return res
      .status(200)
      .json({ success: true, payload: sanitiseUser(updatedUser) });
  } catch (err) {
    console.error('ERROR - user.js - put - user: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

router.get('/token/confirm/:token', auth, async (req, res) => {
  const { error, value } = tokenValidation.validate(req.params);
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }
  const { token } = value;
  try {
    const verificationToken = await AccountVerificationToken.findOne({ where: { token } });
    if (!verificationToken) {
      return res
        .status(401)
        .json({ success: false, payload: { message: 'Invalid token' } });
    }

    if (verificationToken.userId !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, payload: { message: 'You do not have permission to verify this token' } });
    }

    if (hasExpired(verificationToken.expires)) {
      await verificationToken.destroy();
      return res.status(401).json({
        success: false,
        payload: { message: 'This token has expired' },
      });
    }

    const user = await User.findByPk(verificationToken.userId);

    const updatedUser = await user.update({
      isVerified: true,
    });

    await verificationToken.destroy();

    return res.status(200).json({
      success: true,
      payload: sanitiseUser(updatedUser),
    });
  } catch (err) {
    console.error('ERROR - user.js - / get confirm/:id: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

router.get('/token/retry', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user.isVerified) {
      return res.status(401).json({
        success: false,
        payload: {
          message: 'This user has already been verified',
        },
      });
    }

    const verificationToken = await AccountVerificationToken.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (verificationToken) {
      await verificationToken.destroy();
    }
    const currentDate = getCurrentDate();
    const newVerificationToken = await AccountVerificationToken.create({
      id: uuid.v4(),
      userId: req.user.id,
      token: generateToken(),
      expires: DateTime.fromISO(currentDate).plus({ minutes: 30 }).toISO(),
      createdAt: currentDate,
    });
  
    await sendMail(req.user.id, newVerificationToken.token, req.headers.host);

    return res.status(200).json({
      success: true,
      payload: {
        message: 'Sent verification token',
      },
    });
  } catch (err) {
    console.error('ERROR - user.js - / get retry', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

module.exports = router;
