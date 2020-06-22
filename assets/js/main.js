const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');

// Login
if (loginButton) {
  loginButton.addEventListener('click', async event => {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    if (username && password) {
      const domain = window.location.origin;
      try {
        loginButton.classList.add('loading');
        const response = await fetch(`${domain}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username.value,
            password: password.value
          }),
          credentials: 'include'
        });
        loginButton.classList.remove('loading');
        if (!response.ok) {
          if (!document.querySelector('#alertMsg')) {
            const form = document.querySelector('.form');
            const alert = document.createElement('div');
            alert.classList.add('ui', 'negative', 'message');
            alert.id = 'alertMsg';
            const message = document.createElement('div');
            message.classList.add('header');
            message.textContent = 'Username or password is incorrect';
            alert.appendChild(message);
            form.appendChild(alert);
            setTimeout(() => {
              form.removeChild(alert);
            }, 3000);
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
}

// Register
if (registerButton) {
  registerButton.addEventListener('click', async event => {
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    if (username && email && password && confirmPassword) {
      const domain = window.location.origin;
      try {
        registerButton.classList.add('loading');
        const response = await fetch(`${domain}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value
          }),
          credentials: 'include'
        });
        registerButton.classList.remove('loading');
        if (!response.ok) {
          if (!document.querySelector('#alertMsg')) {
            const form = document.querySelector('.form');
            const alert = document.createElement('div');
            alert.classList.add('ui', 'negative', 'message');
            alert.id = 'alertMsg';
            const message = document.createElement('div');
            message.classList.add('header');
            message.textContent = 'Incorrect input';
            alert.appendChild(message);
            form.appendChild(alert);
            setTimeout(() => {
              form.removeChild(alert);
            }, 3000);
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
}
