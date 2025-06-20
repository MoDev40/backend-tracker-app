const { createTaskValidator, updateTaskValidator, assignTaskValidator, assignMultipleTasksValidator } = require("../validators/task.validator");

// Task validation middleware
const validateCreateTask = (req, res, next) => {
    const { error } = createTaskValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateUpdateTask = (req, res, next) => {
    const { error } = updateTaskValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateAssignTask = (req, res, next) => {
    const { error } = assignTaskValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateAssignMultipleTasks = (req, res, next) => {
    const { error } = assignMultipleTasksValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};


module.exports = {
    validateCreateTask,
    validateUpdateTask,
    validateAssignTask,
    validateAssignMultipleTasks
};