import { alert } from './lib.js';
import { register } from './api.js';

const registerButton = document.getElementById('registerButton');


registerButton.addEventListener('click', async event => {
  const username = document.getElementById('username');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const form = document.querySelector('.form');

  if (username.value && email.value && password.value && confirmPassword.value) {
    if (
      (password.value.length < 8 || password.value.length > 255) &&
      (confirmPassword.value.length < 8 || confirmPassword.value.length > 255)
    ) {
      alert(form, 'Password must be between 8 and 255');
      return null;
    }
    if (password.value !== confirmPassword.value) {
      alert(form, 'Passwords must match');
      return null;
    }
    const domain = window.location.origin;
    registerButton.classList.add('loading');
    try {
      const response = await register(username.value, email.value, password.value, confirmPassword.value);
      registerButton.classList.remove('loading');
      const data = await response.json();
      if (data.errors && data.errors.length > 0) {
        for (const error of data.errors) {
          alert(form, error.msg);
        }
      }
      if (data.success) {
        window.location.replace(`${domain}/auth/login`);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    alert(form, 'Incorrect input');
  }
});