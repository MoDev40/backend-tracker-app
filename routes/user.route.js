const express = require("express");
const {
  registerUser,
  getAlUsers,
  getUser,
  deleteUser,
  loginUser,
} = require("../controllers/user.controller");
const {
  registerUserMiddleware,
  loginUserMiddleware,
} = require("../middlewares/user.middleware");
const verifyToken = require("../middlewares/verifyToken");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.post("/register", registerUserMiddleware, registerUser);
router.post("/login", loginUserMiddleware, loginUser);
router.get("/", verifyToken, authorize("admin"), getAlUsers);
router.delete("/:id", authorize("admin"), deleteUser);
router.get("/:id", getUser);
module.exports = router;
