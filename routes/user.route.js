const express = require("express");
<<<<<<< HEAD
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
=======
const { registerUser , getAlUsers, getUser, deleteUser, loginUser, updateUser, getUserStats} = require("../controllers/user.controller");
const { registerUserMiddleware, loginUserMiddleware } = require("../middlewares/user.middleware");
const verifyToken = require("../middlewares/verifyToken");
const { checkRole } = require("../middlewares/checkRole");
>>>>>>> 46c358a8a48fbca4e453ef957635a39998f6cc88

const router = express.Router();

<<<<<<< HEAD
router.post("/register", registerUserMiddleware, registerUser);
router.post("/login", loginUserMiddleware, loginUser);
router.get("/", verifyToken, authorize("admin"), getAlUsers);
router.delete("/:id", authorize("admin"), deleteUser);
router.get("/:id", getUser);
module.exports = router;
=======
router.post('/register', registerUserMiddleware ,registerUser)
router.post('/login', loginUserMiddleware, loginUser)
router.get("/stats", verifyToken, checkRole(["admin"]), getUserStats)
router.get("/", verifyToken, checkRole(["admin"]), getAlUsers)
router.get("/:id", verifyToken, checkRole(["admin", "user"]), getUser)
router.patch("/:id", verifyToken, checkRole(["admin"]), updateUser)
router.delete("/:id", verifyToken, checkRole(["admin"]), deleteUser)

module.exports = router
>>>>>>> 46c358a8a48fbca4e453ef957635a39998f6cc88
