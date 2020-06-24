import { alert } from './lib.js';
import { login } from './api.js';

const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', async event => {
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const form = document.querySelector('.form');
  if (username.value && password.value) {
    const domain = window.location.origin;
    loginButton.classList.add('loading');
    try {
      const response = await login(username.value, password.value);
      loginButton.classList.remove('loading');
      if (!response.ok) {
        alert(form, 'Invalid credentials');
      }
      const data = await response.json();
      if (data.success) {
        window.location.replace(domain);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    alert(form, 'Username or password is empty or incorrect');
  }
});