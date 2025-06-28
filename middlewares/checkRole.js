

const checkRole = (roles) => {
    return ( req, res, next) => {
        console.log(req.user)
        if(!roles?.includes(req.user.role)) {
            return res.status(403).json({ message: "You are not authorized to access this resource", roles, userRole: req.user.role})
        }
        next();
    }
}


module.exports = {
    checkRole
}