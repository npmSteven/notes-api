const express = require('express');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const router = express.Router();

const User = require('../../Models/User');

router.post(
  '/login',
  passport.authenticate('local'),
  (req, res) => {
    return res.status(200).json({ msg: 'Logged in', success: true });
  }
);

router.post(
  '/register',
  [
    check('username').exists({ checkFalsy: true, checkNull: true }),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 8, max: 255 }).withMessage('Password must be between 8 - 255 in length'),
    check('confirmPassword').isLength({ min: 8, max: 255 }).withMessage('Password must be between 8 - 255 in length')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(422).json({ success: false, errors: [ { msg: 'Passwords must match', param: 'confirmPassword', location: 'body' } ] });
    }
    // Check if user already exists
    const currentUser = await User.findOne({ where: { username } });
    if (currentUser) {
      return res.status(422).json({ success: false, errors: [ { msg: 'User already exists' } ] });
    }
    // Create the user
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, async (error, hash) => {
        if (error) throw error;
        try {
          await User.create({ id: uuid.v4(), username, email, password: hash });
          return res.status(200).json({ msg: 'Account has been created', success: true });
        } catch (error) {
          console.log('ERROR - auth.js - /register post: ', error);
          return res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
        }
      });
    });
  }
);

router.get(
  '/logout',
  (req, res) => {
    req.logOut();
    return res.status(200).json({ success: true, msg: 'Logged out' });
  }
)

module.exports = router;
