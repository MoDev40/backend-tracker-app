const { createProjectValidator, updateProjectValidator } = require("../validators/project.validator");

const validateCreateProject = (req, res, next) => {
    const { error } = createProjectValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateUpdateProject = (req, res, next) => {
    const { error } = updateProjectValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateCreateProject,
    validateUpdateProject
}; 