const Task = require("../models/task.schema");

const addTask = async (req, res) => {
  try {
    const body = req.body;
    const data = { ...body, ownedBy: req.user.id };
    const newTask = await Task.create(data);
    res
      .status(200)
      .json({ message: "Task created successfully", data: newTask });
  } catch (error) {}
};

module.exports = addTask;
