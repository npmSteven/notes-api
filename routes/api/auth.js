const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const registerValidation = require('../../validation/registerValidation');
const loginValidation = require('../../validation/loginValidation');
const config = require('../../config');
const { generateHash } = require('../../common/auth');
const auth = require('../../middleware/auth');
const lib = require('../../lib');
const { userUpdatePasswordValidation } = require('../../validation/userValidation');
const User = require('../../models/User');
const { getUser } = require('../../common/user');

const router = express.Router();

/**
 * Create a user
 * @property {string} username - The user's username
 * @property {string} password - The user's password
 */
router.post('/login', async (req, res) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          payload: { message: 'Username doesn\'t exist' },
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({
          success: false,
          payload: { message: 'Password is incorrect' },
        });
    }

    const token = jwt.sign({ id: user.id }, config.jwt.secret, {
      expiresIn: 86400,
    });
    if (!token) {
      return res
        .status(500)
        .json({
          success: false,
          payload: { message: 'Couldn\'t sign the token' },
        });
    }

    return res.status(200).json({
      success: true,
      payload: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (err) {
    console.log('ERROR - auth.js - post - login: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

/**
 * Authenticates a user
 * @property {string} username - The user's username
 * @property {string} email - The user's email
 * @property {string} password - The user's password
 */
router.post('/register', async (req, res) => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      return res
        .status(401)
        .json({
          success: false,
          payload: { message: 'Username already exists' },
        });
    }

    const hash = await generateHash(password);

    const newUser = await User.create({
      id: uuid.v4(),
      username,
      email,
      password: hash,
    });
    if (!newUser) {
      return res
        .status(500)
        .json({
          success: false,
          payload: { message: 'Something went wrong with saving the user' },
        });
    }

    const token = jwt.sign({ id: newUser.id }, config.jwt.secret, {
      expiresIn: 86400,
    });
    if (!token) {
      return res
        .status(500)
        .json({
          success: false,
          payload: { message: 'Couldn\'t sign the token' },
        });
    }

    return res.status(200).json({
      success: true,
      payload: {
        token,
        user: getUser(newUser),
      },
    });
  } catch (err) {
    console.log('ERROR - auth.js - post - register: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

// Update password
router.put('/password', auth, lib.validateUser, async (req, res) => {
  const { error } = userUpdatePasswordValidation.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }
  try {
    const user = await User.findByPk(req.user.id);

    const { currentPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({
          success: false,
          payload: { message: 'Current password is incorrect' },
        });
    }

    const hash = await generateHash(newPassword);

    const updatedUser = await user.update({ password: hash });

    return res.status(200).json({
      success: true,
      payload: getUser(updatedUser),
    });
  } catch (err) {
    console.log('ERROR - auth.js - put - password: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

module.exports = router;
