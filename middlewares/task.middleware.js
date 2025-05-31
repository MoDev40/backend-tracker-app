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
