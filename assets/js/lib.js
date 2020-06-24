const alert = (parent, msg, status = 'negative') => {
  const errorAlert = document.createElement('div');
  errorAlert.classList.add('ui', status, 'message');
  errorAlert.id = 'alertMsg';
  const message = document.createElement('div');
  message.classList.add('header');
  message.textContent = msg;
  errorAlert.appendChild(message);
  parent.appendChild(errorAlert);
  setTimeout(() => {
    parent.removeChild(errorAlert);
  }, 3000);
}

export { alert };
