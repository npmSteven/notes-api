module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/auth/login');
  },
  alreadyAuthed: (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    return next();
  },
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
