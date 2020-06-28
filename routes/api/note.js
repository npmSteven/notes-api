const express = require('express');
const { check, validationResult } = require('express-validator');
const uuid = require('uuid');

const lib = require('../../lib');
const Note = require('../../Models/Note');

const router = express.Router();

// @route GET api/note
// @desc Gets all of the available notes for that user
// @access private
router.get('/', lib.validateUser, async (req, res) => {
  try {
    // Check if the user has any notes
    const notes = await Note.findAll({ where: { userId: user.id } });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.log('ERROR - note.js - / get notes: ', error);
    res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
  }
});

// @route GET api/note/:id
// @desc Get a specific note
// @access private
router.get(
  '/:id',
  [
    check('id').isUUID(),
  ],
  lib.validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    try {
      // Check if the note exists
      const note = await Note.findByPk(req.params.id)
      if (!note) {
        return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
      }
      // Check if the user owns the note
      if (user.id === note.userId) {
        return res.status(200).json({ success: true, note });
      }
      return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
    } catch (error) {
      console.log('ERROR - note.js - / get notes: ', error);
      res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
    }
  }
)

// @route POST api/note/:id
// @desc Adds a note
// @access private
router.post(
  '/',
  [
    check('title').exists({ checkFalsy: true, checkNull: true }),
    check('content').exists({ checkFalsy: true, checkNull: true })
  ],
  lib.validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    const { title, content } = req.body
    try {
      const savedNote = await Note.create({
        id: uuid.v4(),
        userId: req.user.id,
        title,
        content
      });
      return res.status(200).json({ success: true, note: savedNote });
    } catch (error) {
      console.log('ERROR - note.js - / post', error);
      res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
    }
  }
);

// @route PATCH api/note/:id
// @desc Patches a note
// @access private
router.patch(
  '/:id',
  [
    check('id').isUUID(),
    check('title').exists({ checkFalsy: true, checkNull: true }),
    check('content').exists({ checkFalsy: true, checkNull: true }),
  ],
  lib.validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    const { id } = req.params;
    const { title, content } = req.body
    try {
      // Check if the note exists in the database
      const note = await Note.findByPk(id);
      if (!note) {
        return res.status(404).json({ success: false, errors: [ { msg: `Note doesn't exist` } ] });
      }
      // Check if the user owns the note
      if (user.id === note.userId) {
        const updatedNote = await note.update({
          title,
          content
        });
        return res.status(200).json({ success: true, note: updatedNote });
      }
      return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
    } catch (error) {
      console.log('ERROR - note.js - / patch', error);
      return res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
    }
  }
);

// @route DELETE api/note/:id
// @desc Deletes a note
// @access private
router.delete(
  '/:id',
  [
    check('id').isUUID()
  ],
  lib.validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    const { id } = req.params;
    try {
      // Check if the note exists in the database
      const note = await Note.findByPk(id);
      if (!note) {
        return res.status(404).json({ success: false, errors: [ { msg: `Note doesn't exist` } ] });
      }
      // Check if the user owns the note
      if (user.id === note.userId) {
        const deleteNote = await note.destroy();
        return res.status(200).json({ success: true, note: deleteNote });
      }
      return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
    } catch (error) {
      console.log('ERROR - note.js - / patch', error);
      return res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
    }
  }
);

module.exports = router;
