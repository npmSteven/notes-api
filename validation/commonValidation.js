const Joi = require('@hapi/joi');

module.exports.idValidation = Joi.object({
  id: Joi.string().uuid().required(),
});
