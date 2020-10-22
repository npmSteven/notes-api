const Joi = require('@hapi/joi');

module.exports = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  password: Joi.string().min(8).max(255).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
    .required(),
});
