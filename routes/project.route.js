const express = require("express");
const { createProject, updateProject, getProjectById, deleteProject , getProjects, getProjectStats} = require("../controllers/project.controller");
const { validateCreateProject, validateUpdateProject } = require("../middlewares/project.middleware");
const verifyToken = require("../middlewares/verifyToken");
const { checkRole } = require("../middlewares/checkRole");
const router = express.Router();

router.post("/", verifyToken, checkRole(["admin", "user"]), validateCreateProject, createProject)
router.patch("/:id", verifyToken, checkRole(["admin", "user"]), validateUpdateProject, updateProject)
router.get("/stats", verifyToken, checkRole(["admin", "user"]), getProjectStats)
router.get("/:id", verifyToken, checkRole(["admin", "user"]), getProjectById)
router.delete("/:id", verifyToken, checkRole(["admin", "user"]), deleteProject)
router.get("/", verifyToken, checkRole(["admin", "user"]), getProjects)

module.exports = router