const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");
const { addTaskMiddleware } = require("../middlewares/task.middleware");
const {
  addTask,
  getAllTasks,
  getTask,
} = require("../controllers/task.controller");

const router = express.Router();

router.post("/add", verifyToken, authorize("user"), addTaskMiddleware, addTask);
router.get("/", verifyToken, getAllTasks);
router.get("/:id", verifyToken, getTask);

module.exports = router;
