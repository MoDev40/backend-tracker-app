const Task = require("../models/task.schema");

const addTask = async (req, res) => {
  try {
    const body = req.body;
    const data = { ...body, ownedBy: req.user.id };
    const newTask = await Task.create(data);
    res
      .status(200)
      .json({ message: "Task created successfully", data: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ ownedBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ message: "Tasks loaded successfully", data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.find({
      $and: [{ ownedBy: req.user.id }, { _id: id }],
    });
    res.status(200).json({ message: "Task loaded successfully", data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addTask, getAllTasks, getTask };
