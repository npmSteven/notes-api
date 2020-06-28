const express = require('express');
const uuid = require('uuid');

const lib = require('../../lib');
const Note = require('../../models/Note');
const auth = require('../../middleware/auth');
const { idValidation, addNoteValidation, updateNoteValidation } = require('../../validation/noteValidation');


const router = express.Router();

// @route GET api/note
// @desc Gets all of the available notes for that user
// @access private
router.get('/', auth, lib.validateUser, async (req, res) => {
  try {
    // Check if the user has any notes
    const notes = await Note.findAll({ where: { userId: req.user.id } });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.log('ERROR - note.js - / get notes: ', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route GET api/note/:id
// @desc Get a specific note
// @access private
router.get(
  '/:id',
  auth,
  lib.validateUser,
  async (req, res) => {
    const { error } = idValidation.validate(req.params);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    try {
      // Check if the note exists
      const note = await Note.findByPk(req.params.id)
      if (!note) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      // Check if the user owns the note
      if (req.user.id === note.userId) {
        return res.status(200).json({ success: true, note });
      }
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    } catch (error) {
      console.log('ERROR - note.js - / get notes: ', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
)

// @route POST api/note/:id
// @desc Adds a note
// @access private
router.post(
  '/',
  auth,
  lib.validateUser,
  async (req, res) => {
    const { error } = addNoteValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
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
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
);

// @route PATCH api/note/:id
// @desc Patches a note
// @access private
router.patch(
  '/:id',
  auth,
  lib.validateUser,
  async (req, res) => {
    const { error } = updateNoteValidation.validate({ ...req.params, ...req.body });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const { id } = req.params;
    const { title, content } = req.body
    try {
      // Check if the note exists in the database
      const note = await Note.findByPk(id);
      if (!note) {
        return res.status(404).json({ success: false, message: `Note doesn't exist` });
      }
      // Check if the user owns the note
      if (req.user.id === note.userId) {
        const updatedNote = await note.update({
          title,
          content
        });
        return res.status(200).json({ success: true, note: updatedNote });
      }
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    } catch (error) {
      console.log('ERROR - note.js - / patch', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
);

// @route DELETE api/note/:id
// @desc Deletes a note
// @access private
router.delete(
  '/:id',
  auth,
  lib.validateUser,
  async (req, res) => {
    const { error } = idValidation.validate(req.params);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const { id } = req.params;
    try {
      // Check if the note exists in the database
      const note = await Note.findByPk(id);
      if (!note) {
        return res.status(404).json({ success: false, message: `Note doesn't exist` });
      }
      // Check if the user owns the note
      if (req.user.id === note.userId) {
        await note.destroy();
        return res.status(200).json({ success: true, message: 'Note deleted' });
      }
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    } catch (error) {
      console.log('ERROR - note.js - / patch', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
);

module.exports = router;
