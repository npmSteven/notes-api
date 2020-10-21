const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const UserModal = require('../../models/User');
const registerValidation = require('../../validation/registerValidation');
const loginValidation = require('../../validation/loginValidation');
const auth = require('../../middleware/auth');
const config = require('../../config');

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
    const user = await UserModal.findOne({ where: { username } });
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
      .json({ success: false, message: 'Internal server error' });
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
      .json({ success: false, message: error.details[0].message });
  }
  const { username, email, password } = req.body;
  try {
    const user = await UserModal.findOne({ where: { username } });
    if (user) {
      return res
        .status(401)
        .json({
          success: false,
          payload: { message: 'Username already exists' },
        });
    }

    const salt = await bcrypt.genSalt(10);
    if (!salt) {
      return res
        .status(500)
        .json({
          success: false,
          payload: { message: 'Something went wrong with bcrypt - salt' },
        });
    }

    const hash = await bcrypt.hash(password, salt);
    if (!hash) {
      return res
        .status(500)
        .json({
          success: false,
          payload: { message: 'Something went wrong with bcrypt - hash' },
        });
    }

    const newUser = await UserModal.create({
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
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      },
    });
  } catch (err) {
    console.log('ERROR - auth.js - post - register: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

/**
 * Get a user's details
 */
router.get('/user', auth, async (req, res) => {
  try {
    const user = await UserModal.findByPk(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, payload: { message: 'Cannot find account' } });
    }
    return res.json({
      success: true,
      payload: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.log('ERROR - auth.js - get - user: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

module.exports = router;
