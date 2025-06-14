const express = require("express");
const { createProject, updateProject, getProjectById, deleteProject , GetProjects} = require("../controllers/project.controller");
const verifyToken = require("../middlewares/verifyToken");
const { checkRole } = require("../middlewares/checkRole");
const router = express.Router();

router.post("/", verifyToken, checkRole(["admin", "user"]), createProject)
router.patch("/:id", verifyToken, checkRole(["admin", "user"]), updateProject)
router.get("/:id", verifyToken, checkRole(["admin", "user"]), getProjectById)
router.delete("/:id", verifyToken, checkRole(["admin", "user"]), deleteProject)
router.get("/", verifyToken, checkRole(["admin", "user"]), GetProjects)


module.exports = router