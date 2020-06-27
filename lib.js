module.exports = {
  // Check if a use is authenticated if they aren't we will redirect them to the login page
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/auth/login');
  },
  // This method should only be used on an already authenticated user
  // for register and login as they do not need to go to these routes as they are already authenticated
  // We check if the user is authenticated if they are then we will redirect them to the root
  // if they aren't authenticated we will allow them to visit that route
  alreadyAuthed: (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    return next();
  },
  // We use this method so that we can pass the user object in and get an object back
  // without any exploitable information
  getUserUi: (user) => {
    if (user) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }
    return null;
  }
};
