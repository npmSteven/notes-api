module.exports.sanitiseUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

module.exports.sanitiseEmail = (email) => email.toLowerCase();
