import { getNote, updateNote, deleteNote } from './api.js';
import { alert } from './lib.js';

const alertContainer = document.getElementById('alert-container');
const noteContainer = document.getElementById('note-container');
const title = document.getElementById('title');
const content = document.getElementById('content');

const updateButton = document.getElementById('update');
const deleteButton = document.getElementById('delete');

const { id } = noteContainer.dataset;

updateButton.addEventListener('click', async event => {
  try {
    const response = await updateNote(id, title.value, content.value);
    if (response && response.ok) {
      const data = await response.json();
      if (data.success) {
        alert(alertContainer, 'Updated note', 'success');
      }
    }
  } catch (error) {
    console.log('ERROR - note.js - updateButton() ', error);
  }
});

deleteButton.addEventListener('click', async event => {
  try {
    const response = await deleteNote(id);
    if (response && response.ok) {
      const data = await response.json();
      if (data.success) {
        window.location.replace(`${window.location.origin}/note`);
      }
    }
  } catch (error) {
    console.log('ERROR - note.js - updateButton() ', error);
  }
});

const attachNote = async () => {
  try {
    const response = await getNote(id);
    if (response && response.ok) {
      const data = await response.json();
      if (data.success) {
        title.textContent = data.note.title;
        content.textContent = data.note.content;
      }
    }
  } catch (error) {
    console.log('ERROR - note.js - attachNote() ', error);
  }

};

attachNote();

