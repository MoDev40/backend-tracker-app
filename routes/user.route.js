const express = require("express");
const { registerUser , getAlUsers, getUser, deleteUser, loginUser} = require("../controllers/user.controller");
const { registerUserMiddleware } = require("../middlewares/user.middleware");
const verifyToken = require("../middlewares/verifyToken");
const { checkRole } = require("../middlewares/checkRole");

const router  = express.Router()

router.post('/register', registerUserMiddleware ,registerUser)
router.post('/login', loginUser)
router.get("/", verifyToken, checkRole("admin"), getAlUsers)
router.delete("/:id", deleteUser)
router.get("/:id", getUser)
module.exports = router
