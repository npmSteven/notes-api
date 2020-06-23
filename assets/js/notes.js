import { getNotes } from './api.js';

const notesList = document.getElementById('notes-list');

// Attach notes
const attachNotes = async () => {
  const domain = window.location.origin;
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
