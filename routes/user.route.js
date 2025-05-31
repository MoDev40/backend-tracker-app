const express = require("express");
const { registerUser , getAlUsers, getUser, deleteUser} = require("../controllers/user.controller");
const { registerUserMiddleware } = require("../middlewares/user.middleware");
const verifyToken = require("../middlewares/verifyToken");

const router  = express.Router()

router.post('/register', registerUserMiddleware ,registerUser)
router.get("/", verifyToken, getAlUsers)
router.delete("/:id", deleteUser)
router.get("/:id", getUser)
module.exports = router
