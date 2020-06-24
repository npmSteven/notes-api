const express = require('express');
const { check, validationResult } = require('express-validator');
const uuid = require('uuid');

const lib = require('../../lib');
const Note = require('../../Models/Note');
const User = require('../../Models/User');

const router = express.Router();

/**
 * @desc Get all of the available notes
 */
router.get('/', async (req, res) => {
  try {
    if (req.user && req.user.id) {
      const user = await User.findByPk(req.user.id);
      if (user) {
        const notes = await Note.findAll({ where: { userId: user.id } });
        if (!notes) {
          notes = [];
        }
        return res.status(200).json({ success: true, notes });
      }
      return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
    }
    return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
  } catch (error) {
    console.log('ERROR - note.js - / get notes: ', error);
    res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
  }
});

// Get a note
router.get(
  '/:id',
  [
    check('id').isUUID(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    try {
      if (req.user && req.user.id) {
        const user = await User.findByPk(req.user.id);
        if (user) {
          const note = await Note.findByPk(req.params.id)
          if (note) {
            if (user.id === note.userId) {
              return res.status(200).json({ success: true, note });
            }
            return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
          }
          return res.status(404).json({ success: false, errors: [ { msg: `Note doesn't exist` } ] });
        }
        return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
      }
      return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
    } catch (error) {
      console.log('ERROR - note.js - / get notes: ', error);
      res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
    }
  }
)

router.post(
  '/',
  [
    check('title').exists({ checkFalsy: true, checkNull: true }),
    check('content').exists({ checkFalsy: true, checkNull: true })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    const { title, content } = req.body
    try {
      if (req.user && req.user.id) {
        const user = await User.findByPk(req.user.id);
        if (user) {
          const savedNote = await Note.create({
            id: uuid.v4(),
            userId: req.user.id,
            title,
            content
          });
          return res.status(200).json({ success: true, note: savedNote });
        }
        return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
      }
      return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
    } catch (error) {
      console.log('ERROR - note.js - / post', error);
      res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
    }
  }
);

router.patch(
  '/:id',
  [
    check('id').isUUID(),
    check('title').exists({ checkFalsy: true, checkNull: true }),
    check('content').exists({ checkFalsy: true, checkNull: true }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    const { id } = req.params;
    const { title, content } = req.body
    try {
      const user = await User.findByPk(req.user.id);
      if (user) {
        const note = await Note.findByPk(id);
        if (note) {
          if (user.id === note.userId) {
            const updatedNote = await note.update({
              title,
              content
            });
            return res.status(200).json({ success: true, note: updatedNote });
          }
          return res.status(404).json({ success: false, errors: [ { msg: `Note doesn't exist` } ] });
        }
        return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
      }
    } catch (error) {
      console.log('ERROR - note.js - / patch', error);
      return res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
    }
  }
);

router.delete(
  '/:id',
  [
    check('id').isUUID()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    const { id } = req.params;
    try {
      const user = await User.findByPk(req.user.id);
      if (user) {
        const note = await Note.findByPk(id);
        if (note) {
          if (user.id === note.userId) {
            const deleteNote = await note.destroy();
            return res.status(200).json({ success: true, note: deleteNote });
          }
          return res.status(404).json({ success: false, errors: [ { msg: `Note doesn't exist` } ] });
        }
        return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
      }
      return res.status(401).json({ success: false, errors: [ { msg: 'Unauthorized' } ] });
    } catch (error) {
      console.log('ERROR - note.js - / patch', error);
      return res.status(500).json({ success: false, errors: [ { msg: 'Internal server error' } ] });
    }
  }
);

module.exports = router;
