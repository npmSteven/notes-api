const express = require('express');

const { deleteNotes } = require('../../common/note');
const { sanitiseUser } = require('../../common/user');
const { getCurrentDate } = require('../../lib');
const lib = require('../../lib');
const auth = require('../../middleware/auth');
const Note = require('../../models/Note');
const User = require('../../models/User');
const { userUpdateValidation } = require('../../validation/userValidation');

const router = express.Router();

/**
 * Get a user's details
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, payload: { message: 'Cannot find account' } });
    }
    return res.json({
      success: true,
      payload: sanitiseUser(user),
    });
  } catch (err) {
    console.log('ERROR - user.js - get - user: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

// User delete
router.delete('/', auth, lib.validateUser, async (req, res) => {
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
    console.log('ERROR - user.js - delete - user: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

// Update user
router.put('/', auth, lib.validateUser, async (req, res) => {
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
    console.log('ERROR - user.js - put - user: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

module.exports = router;
