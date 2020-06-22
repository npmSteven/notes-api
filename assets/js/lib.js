const alert = (parent, msg) => {
  const errorAlert = document.createElement('div');
  errorAlert.classList.add('ui', 'negative', 'message');
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
