const domain = window.location.origin;

const register = async (username, email, password, confirmPassword) => {
  const response = await fetch(`${domain}/auth/register`, {
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
}

const login = async (username, password) => {
  const response = await fetch(`${domain}/auth/login`, {
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
}

export { login, register };
