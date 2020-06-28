const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const router = express.Router();

const User = require('../../Models/User');
const registerValidation = require('../../validation/registerValidation');
const lib = require('../../lib');

// @route POST api/auth/login
// @desc Authenticates a preexisting user
// @access public
router.post(
  '/login',
  passport.authenticate('local'),
  (req, res) => {
    return res.status(200).json({ msg: 'Logged in', success: true });
  }
);

// @route POST api/auth/register
// @desc Creates a user in the database
// @access public
router.post(
  '/register',
  async (req, res) => {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, errors: [ { msg: error.details } ] });
    }

    const { username, email, password } = req.body;
    // Check if user already exists
    const currentUser = await User.findOne({ where: { username } });
    if (currentUser) {
      return res.status(401).json({ success: false, errors: [ { msg: 'User already exists' } ] });
    }
    // Create the user
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, async (error, hash) => {
        if (error) throw error;
        try {
          const savedUser = await User.create({ id: uuid.v4(), username, email, password: hash });
          return res.status(201).json({ msg: 'Account has been created', success: true, user: lib.getUser(savedUser) });
        } catch (error) {
          console.log('ERROR - auth.js - /register post: ', error);
          return res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
        }
      });
    });
  }
);

// @route GET api/auth/logout
// @desc Logout an authenticated user
// @access public
router.get(
  '/logout',
  (req, res) => {
    req.logOut();
    return res.status(200).json({ success: true, msg: 'Logged out' });
  }
)

module.exports = router;
