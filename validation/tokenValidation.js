const Joi = require('@hapi/joi');

const { token } = require('./commonValidation');

module.exports = Joi.object({
  token,
});
