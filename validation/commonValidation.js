const Joi = require('@hapi/joi');

module.exports.id = Joi.string().uuid().required();

module.exports.idValidation = Joi.object({
  id: this.id,
});

module.exports.text = Joi.string().alphanum().min(1).max(255).required();

module.exports.password = Joi.string().min(8).max(255).required();

module.exports.email = Joi
  .string()
  .lowercase({ force: true })
  .email({ minDomainSegments: 2, tlds: ['com', 'net'] })
  .required();

module.exports.arrayUuids = Joi.array().items(this.id).min(1).required();
