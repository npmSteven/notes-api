const Joi = require('@hapi/joi');

module.exports = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
    .required(),
  password: Joi.string().min(8).max(255).required(),
});
