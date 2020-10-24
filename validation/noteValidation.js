const Joi = require('@hapi/joi');

const { id, text, arrayUuids } = require('./commonValidation');

module.exports.addValidation = Joi.object({
  title: text,
  body: text,
});

module.exports.updateValidation = Joi.object({
  id,
  title: text,
  body: text,
});

module.exports.bulkDelete = Joi.object({
  noteIds: arrayUuids,
});
