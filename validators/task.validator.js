const Joi = require("joi");

<<<<<<< HEAD
const addTaskValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  assignee: Joi.array().required(),
  isDone: Joi.boolean().optional().default(false),
});

module.exports = {
  addTaskValidator,
};
=======
const createTaskValidator = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10).max(500),
    project: Joi.string().hex().length(24).required(),
    assignedTo: Joi.string().hex().length(24).required(),
    priority: Joi.string().valid("low", "medium", "high", "urgent").default("medium"),
    dueDate: Joi.date().greater('now').required()
});

const updateTaskValidator = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).max(500).optional(),
    assignedTo: Joi.string().hex().length(24).optional(),
    status: Joi.string().valid("pending", "in-progress", "completed", "cancelled").optional(),
    priority: Joi.string().valid("low", "medium", "high", "urgent").optional(),
    dueDate: Joi.date().optional()
});

const assignTaskValidator = Joi.object({
    assignedTo: Joi.string().hex().length(24).required()
});

const assignMultipleTasksValidator = Joi.object({
    taskIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
    assignedTo: Joi.string().hex().length(24).required()
});




module.exports = {
    createTaskValidator,
    updateTaskValidator,
    assignTaskValidator,
    assignMultipleTasksValidator
}; 
>>>>>>> 46c358a8a48fbca4e453ef957635a39998f6cc88
