const express = require("express");
const { registerUser , getAlUsers, getUser, deleteUser, loginUser, updateUser} = require("../controllers/user.controller");
const { registerUserMiddleware, loginUserMiddleware } = require("../middlewares/user.middleware");
const verifyToken = require("../middlewares/verifyToken");
const { checkRole } = require("../middlewares/checkRole");

const router  = express.Router()

router.post('/register', registerUserMiddleware ,registerUser)
router.post('/login', loginUserMiddleware, loginUser)
router.get("/", verifyToken, checkRole(["admin"]), getAlUsers)
router.get("/:id", verifyToken, checkRole(["admin", "user"]), getUser)
router.patch("/:id", verifyToken, checkRole(["admin"]), updateUser)
router.delete("/:id", verifyToken, checkRole(["admin"]), deleteUser)

module.exports = router
