const express = require('express');
const uuid = require('uuid');

const lib = require('../../lib');
const auth = require('../../middleware/auth');
const Note = require('../../models/Note');
const {
  addValidation,
  updateValidation,
  bulkDelete,
} = require('../../validation/noteValidation');
const { deleteNotes } = require('../../common/note');
const { idValidation } = require('../../validation/commonValidation');
const { getCurrentDate, paginate } = require('../../lib');
const arrayValidation = require('../../validation/arrayValidation');

const router = express.Router();

/**
 * Get all notes of the authenticated user
 */
router.get('/', auth, lib.validateUser, async (req, res) => {
  const { error, value } = arrayValidation.validate(req.query);
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }

  const {
    order, orderBy, page, pageSize,
  } = value;
  try {
    // Check if the user has any notes
    const notes = await Note.findAll({
      where: { userId: req.user.id },
      order: [[orderBy || 'createdAt', order || 'DESC']],
      ...paginate({ page, pageSize }),
    });

    return res.status(200).json({ success: true, payload: notes });
  } catch (err) {
    console.log('ERROR - note.js - / get notes: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

/**
 * Get a specific note for the authenticated user
 * @param {uuid} id - The id of the note
 */
router.get('/:id', auth, lib.validateUser, async (req, res) => {
  const { error, value } = idValidation.validate(req.params);
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }
  const { id } = value;
  try {
    // Check if the note exists
    const note = await Note.findByPk(id);
    if (!note) {
      return res
        .status(401)
        .json({ success: false, payload: { message: 'Unable to find note' } });
    }
    // Check if the user owns the note
    if (req.user.id === note.userId) {
      return res.status(200).json({ success: true, payload: note });
    }
    return res
      .status(401)
      .json({ success: false, payload: { message: 'Unauthorized' } });
  } catch (err) {
    console.log('ERROR - note.js - / get notes: ', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

/**
 * Create a note for the authenticated user
 * @property {string} title - The title of the note
 * @property {string} content - The content of the note
 */
router.post('/', auth, lib.validateUser, async (req, res) => {
  const { error, value } = addValidation.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }
  const { title, body } = value;
  const currentDate = getCurrentDate();
  try {
    const savedNote = await Note.create({
      id: uuid.v4(),
      userId: req.user.id,
      title,
      body,
      updatedAt: currentDate,
      createdAt: currentDate,
    });
    return res.status(200).json({ success: true, payload: savedNote });
  } catch (err) {
    console.log('ERROR - note.js - / post', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

/**
 * Updated an existing note of an authenticated user
 * @param {uuid} id - The id of the note
 * @property {string} title - The title of the note
 * @property {string} content - The content of the note
 */
router.put('/:id', auth, lib.validateUser, async (req, res) => {
  const { error, value } = updateValidation.validate({
    ...req.params,
    ...req.body,
  });
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }
  const { id, title, content } = value;
  try {
    // Check if the note exists in the database
    const note = await Note.findByPk(id);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, payload: { message: 'Note does not exist' } });
    }
    // Check if the user owns the note
    if (req.user.id === note.userId) {
      const updatedNote = await note.update({
        title,
        content,
        updatedAt: getCurrentDate(),
      });
      return res.status(200).json({ success: true, payload: updatedNote });
    }
    return res
      .status(401)
      .json({ success: false, payload: { message: 'Unauthorized' } });
  } catch (err) {
    console.log('ERROR - note.js - / patch', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

/**
 * Delete an existing note of an authenticated user
 * @param {uuid} id - The id of the note
 */
router.delete('/:id', auth, lib.validateUser, async (req, res) => {
  const { error, value } = idValidation.validate(req.params);
  if (error) {
    return res
      .status(400)
      .json({ success: false, payload: { message: error.details[0].message } });
  }
  const { id } = value;
  try {
    // Check if the note exists in the database
    const note = await Note.findByPk(id);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, payload: { message: 'Note does not exist' } });
    }
    // Check if the user owns the note
    if (req.user.id === note.userId) {
      await note.destroy();
      return res.status(200).json({ success: true, payload: note });
    }
    return res
      .status(401)
      .json({ success: false, payload: { message: 'Unauthorized' } });
  } catch (err) {
    console.log('ERROR - note.js - / delete', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

/**
 * Delete all provided UUID's from the user
 * @body {Array<uuid>} id - Array of UUID's
 */
router.delete('/', auth, lib.validateUser, async (req, res) => {
  const { error, value } = bulkDelete.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      payload: {
        message: error.details[0].message,
      },
    });
  }
  const { noteIds } = value;

  try {
    const hasDeletedNotes = await deleteNotes(noteIds, req.user.id);

    if (hasDeletedNotes) {
      return res.json({ success: true, payload: noteIds });
    }
    return res.json({
      success: false,
      payload: {
        message: 'You do not have permission to delete all of these notes',
      },
    });
  } catch (err) {
    console.log('ERROR - note.js - / delete', err);
    return res
      .status(500)
      .json({ success: false, payload: { message: 'Internal server error' } });
  }
});

module.exports = router;
