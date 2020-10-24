const Joi = require('@hapi/joi');

const { text, email, password } = require('./commonValidation');

module.exports = Joi.object({
  firstName: text,
  lastName: text,
  password,
  email,
});
