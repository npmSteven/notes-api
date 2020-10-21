const Note = require('../models/Note');

const checkOwnsNotes = async (noteIds, userId) => {
  let ownsNotes = null;
  for (const id of noteIds) {
    const note = await Note.findByPk(id);
    if (note) {
      if (note.userId === userId) {
        ownsNotes = true;
      } else {
        ownsNotes = false;
        break;
      }
    } else {
      ownsNotes = false;
      break;
    }
  }
  return ownsNotes;
};

module.exports.deleteNote = (id, userId) => {};

module.exports.deleteNotes = async (noteIds, userId) => {
  const doesOwnsNotes = await checkOwnsNotes(noteIds, userId);
  if (doesOwnsNotes) {
    Note.destroy({ where: { id: noteIds } });
    return true;
  }
  return false;
};
