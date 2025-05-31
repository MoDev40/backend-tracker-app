const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(401).json({ message: "Access denied due to roles " });
    }
    next();
  };
};

module.exports = authorize;
