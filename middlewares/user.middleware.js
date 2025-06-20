const { registerValidator, loginValidator } = require("../validators/user.validator");

const registerUserMiddleware = (req, res, next) => {
    const {error} = registerValidator.validate(req.body);

    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    next();
}

const loginUserMiddleware = (req, res, next) => {
    const {error} = loginValidator.validate(req.body);

    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    next();
}

module.exports = {
    registerUserMiddleware,
    loginUserMiddleware
}
    