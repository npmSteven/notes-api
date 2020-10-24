const Joi = require('@hapi/joi');

const { text, email, password } = require('./commonValidation');

module.exports.userUpdateValidation = Joi.object({
  firstName: text,
  lastName: text,
  email,
});

module.exports.userUpdatePasswordValidation = Joi.object({
  currentPassword: password,
  newPassword: password,
});
