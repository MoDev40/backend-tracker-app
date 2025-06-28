<<<<<<< HEAD
const jwt = require("jsonwebtoken");
const User = require("../models/user.schema");
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("username email role");
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyToken;
=======
const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token) {
        return res.status(401).json({message: "Access denied. No token provided"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded?.user;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token"})
    }
}

module.exports = verifyToken
>>>>>>> 46c358a8a48fbca4e453ef957635a39998f6cc88
