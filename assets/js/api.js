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

const getNotes = async () => {
  try {
    const response = await fetch(`${domain}/api/note`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.log('ERROR - api.js - getNotes(): ', error);
    return null;
  }
};

const getNote = async id => {
  try {
    const response = await fetch(`${domain}/api/note/${id}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.log('ERROR - api.js - getNotes(): ', error);
    return null;
  }
};

const updateNote = async (id, title, content) => {
  try {
    const response = await fetch(`${domain}/api/note/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content
      }),
      credentials: 'include'
    });
    return response;
  } catch (error) {
    console.log('ERROR - api.js - getNotes(): ', error);
    return null;
  }
};

const deleteNote = async id => {
  try {
    const response = await fetch(`${domain}/api/note/${id}`, {
      method: 'DELETE'
    });
    return response;
  } catch (error) {
    console.log('ERROR - api.js - getNotes(): ', error);
    return null;
  }
};

export { login, register, logout, getNotes, getNote, updateNote, deleteNote };
