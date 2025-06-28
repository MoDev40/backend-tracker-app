const express = require("express");
const { 
    createTask, 
    updateTask, 
    getTasks, 
    getTaskById, 
    deleteTask, 
    getTasksByProject,
    assignTask,
    assignMultipleTasks,
    getTasksByUser,
    getTaskStats
} = require("../controllers/task.controller");

const verifyToken = require("../middlewares/verifyToken");
const { checkRole } = require("../middlewares/checkRole");
const { validateCreateTask, validateUpdateTask, validateAssignTask, validateAssignMultipleTasks } = require("../middlewares/task.middleware");

const router = express.Router();

// Task routes
router.post("/", verifyToken, checkRole(["admin", "user"]), validateCreateTask, createTask);
router.get("/stats", verifyToken, checkRole(["admin", "user"]), getTaskStats);
router.get("/", verifyToken, checkRole(["admin", "user"]), getTasks);
router.post("/assign-multiple", verifyToken, checkRole(["admin", "user"]), validateAssignMultipleTasks, assignMultipleTasks);
router.get("/user/:userId", verifyToken, checkRole(["admin", "user"]), getTasksByUser);
router.get("/project/:projectId", verifyToken, checkRole(["admin", "user"]), getTasksByProject);
router.patch("/:id/assign", verifyToken, checkRole(["admin", "user"]), validateAssignTask, assignTask);

router.patch("/:id", verifyToken, checkRole(["admin", "user"]), validateUpdateTask, updateTask);
router.get("/:id", verifyToken, checkRole(["admin", "user"]), getTaskById);
router.delete("/:id", verifyToken, checkRole(["admin", "user"]), deleteTask);

module.exports = router; 
