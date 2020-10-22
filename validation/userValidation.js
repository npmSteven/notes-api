const Joi = require('@hapi/joi');

module.exports.update = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
    .required(),
});
