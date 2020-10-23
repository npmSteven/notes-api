const Joi = require('@hapi/joi');

module.exports.userUpdateValidation = Joi.object({
  firstName: Joi.string().alphanum().min(2).max(30).required(),
  lastName: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
    .required(),
});

module.exports.userUpdatePasswordValidation = Joi.object({
  currentPassword: Joi.string().min(8).max(255).required(),
  newPassword: Joi.string().min(8).max(255).required(),
});
