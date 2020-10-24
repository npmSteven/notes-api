const Joi = require('@hapi/joi');

const { order, orderBy, page, pageSize } = require('./commonValidation');

module.exports = Joi.object({
  order,
  orderBy,
  page,
  pageSize,
});
