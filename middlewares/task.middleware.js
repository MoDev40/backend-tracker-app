<<<<<<< HEAD
const { addTaskValidator } = require("../validators/task.validator");

const addTaskMiddleware = (req, res, next) => {
  const { error } = addTaskValidator.validate(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  addTaskMiddleware,
};
=======
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
>>>>>>> 46c358a8a48fbca4e453ef957635a39998f6cc88
