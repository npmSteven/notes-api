import { alert } from './lib.js';
import { register } from './api.js';

const registerButton = document.getElementById('registerButton');


registerButton.addEventListener('click', async event => {
  const username = document.getElementById('username');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  if (username && email && password && confirmPassword) {
    const domain = window.location.origin;
    registerButton.classList.add('loading');
    try {
      const response = await register(username.value, email.value, password.value, confirmPassword.value);
      registerButton.classList.remove('loading');
      if (!response.ok) {
        if (!document.querySelector('#alertMsg')) {
          const form = document.querySelector('.form');
          alert(form, 'Incorrect input');
        }
      }
      const data = await response.json();
      if (data.success) {
        window.location.replace(`${domain}/auth/login`);
      }
    } catch (error) {
      console.log(error);
    }
  }
});