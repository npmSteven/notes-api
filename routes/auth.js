const express = require('express');

const lib = require('../lib');

const router = express.Router();

router.get(
  '/login',
  lib.alreadyAuthed,
  (req, res) => {
    res.status(200).render('login');
  }
);

router.get(
  '/register',
  lib.alreadyAuthed,
  (req, res) => {
    res.status(200).render('register');
  }
);

module.exports = router;