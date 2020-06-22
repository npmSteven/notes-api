import { alert } from './lib.js';
import { login } from './api.js';

const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', async event => {
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  if (username && password) {
    const domain = window.location.origin;
    loginButton.classList.add('loading');
    try {
      const response = await login(username.value, password.value);
      loginButton.classList.remove('loading');
      if (!response.ok) {
        if (!document.querySelector('#alertMsg')) {
          const form = document.querySelector('.form');
          alert(form, 'Username or password is incorrect');
        }
      }
      const data = await response.json();
      if (data.success) {
        window.location.replace(domain);
      }
    } catch (error) {
      console.log(error);
    }
  }
});