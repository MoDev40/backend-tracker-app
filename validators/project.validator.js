const Joi = require("joi");

const createProjectValidator = Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10).max(500),
    members: Joi.array().items(Joi.string().hex().length(24)).optional()
});

const updateProjectValidator = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).max(500).optional(),
    members: Joi.array().items(Joi.string().hex().length(24)).optional(),
    status: Joi.string().valid("active", "completed", "archived").optional()
});

module.exports = {
    createProjectValidator,
    updateProjectValidator
}; 