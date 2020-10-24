const Joi = require('@hapi/joi');

const { email, password } = require('./commonValidation');

module.exports = Joi.object({
  email,
  password,
});
