const Joi = require("joi");

const addTaskValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  assignee: Joi.array().required(),
  isDone: Joi.boolean().optional().default(false),
});

module.exports = {
  addTaskValidator,
};
