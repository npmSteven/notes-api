import { logout } from './api.js';

const logoutButton = document.getElementById('logout');

if (logoutButton) {
  logoutButton.addEventListener('click', async event => {
    const response = await logout();
    if (response && response.ok) {
      const data = await response.json();
      if (data.success) {
        const domain = window.location.origin;
        window.location.replace(`${domain}/auth/login`);
      }
    }
  });
}
