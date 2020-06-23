const domain = window.location.origin;

const register = async (username, email, password, confirmPassword) => {
  try {
    const response = await fetch(`${domain}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password,
        confirmPassword
      }),
      credentials: 'include'
    });
    return response;
  } catch (error) {
    console.log('ERROR - api.js - register(): ', error);
    return null;
  }
}

const login = async (username, password) => {
  try {
    const response = await fetch(`${domain}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      }),
      credentials: 'include'
    });
    return response;
  } catch (error) {
    console.log('ERROR - api.js - login(): ', error);
    return null;
  }
}

const logout = async () => {
  try {
    const response = await fetch(`${domain}/api/auth/logout`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.log('ERROR - api.js - logout(): ', error);
    return null;
  }
}

export { login, register, logout };
