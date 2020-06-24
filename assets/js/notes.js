import { getNotes, addNote } from './api.js';

const notesList = document.getElementById('notes-list');

const addNoteButton = document.getElementById('add-note');
const saveButton = document.getElementById('add-note-save');
const title = document.getElementById('title');
const content = document.getElementById('content');


// Attach notes
const attachNotes = async () => {
  const response = await getNotes();
  if (response && response.ok) {
    const data = await response.json();
    if (data.success) {
      const { notes } = data;
      for (const note of notes) {
        createNoteSummary(notesList, note.title, note.content, note.id);
      }
    }
  }
}

attachNotes();


// Create note summary
const createNoteSummary = (parent, noteTitle, noteContent, id) => {
  // Create item div
  const item = document.createElement('div');
  item.classList.add('item');

  // Create content div
  const content = document.createElement('a');
  content.classList.add('content');
  content.href = `${window.location.origin}/note/${id}`;

  // Create header anchor
  const header = document.createElement('a');
  header.classList.add('header');
  header.textContent = noteTitle;

  // Create description div
  const description = document.createElement('div');
  description.classList.add('description');
  description.textContent = noteContent;

  item.appendChild(content);

  content.appendChild(header);
  content.appendChild(description);

  parent.appendChild(item);
}

addNoteButton.addEventListener('click', event => {
  $('.ui.modal').modal('show');
});

if (saveButton && title && content) {
  saveButton.addEventListener('click', async event => {
    if (title.value.length > 0 && content.value.length > 0) {
      try {
        const response = await addNote(title.value, content.value);
        if (response && response.ok) {
          const data = await response.json();
          if (data.success) {
            window.location.href = `${window.location.origin}/note/${data.note.id}`;
          }
        }
      } catch (error) {

      }
    }
  });
}
