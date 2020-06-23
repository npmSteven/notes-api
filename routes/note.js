const express = require('express');

const lib = require('../lib');

const router = express.Router();

router.get('/', lib.ensureAuthenticated, async (req, res) => {
  const user = lib.getUserUi(req.user);
  res.status(200).render('note', { user });
});


module.exports = router;
