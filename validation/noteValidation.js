const Joi = require('@hapi/joi');

module.exports.addValidation = Joi.object({
  title: Joi.string().min(1).required(),
  body: Joi.string().min(1).required(),
});

module.exports.updateValidation = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string().min(1).required(),
  body: Joi.string().min(1).required(),
});

module.exports.bulkDelete = Joi.object({
  noteIds: Joi.array().items(Joi.string().uuid().required()).min(1).required(),
});
