const { registerValidator, loginValidator } = require("../validators/user.validator");


const registerUserMiddleware = (req, res, next) => {
    const {error} = registerValidator.validate(req.body);

    if(error){
        res.status(400).json({message: error.details[0].message})
    }
    next();

}


module.exports = {
    registerUserMiddleware
}
    