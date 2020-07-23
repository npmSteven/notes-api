const Joi = require('@hapi/joi');

module.exports.idValidation = Joi.object({
  id: Joi.string().uuid().required(),
});

module.exports.addNoteValidation = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().min(1).required(),
});

module.exports.updateNoteValidation = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string().min(1).required(),
  content: Joi.string().min(1).required(),
});
