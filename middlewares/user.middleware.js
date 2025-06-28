<<<<<<< HEAD
const {
  registerValidator,
  loginValidator,
} = require("../validators/user.validator");
=======
const { registerValidator, loginValidator } = require("../validators/user.validator");
>>>>>>> 46c358a8a48fbca4e453ef957635a39998f6cc88

const registerUserMiddleware = (req, res, next) => {
  const { error } = registerValidator.validate(req.body);

<<<<<<< HEAD
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const loginUserMiddleware = (req, res, next) => {
  const { error } = loginValidator.validate(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  registerUserMiddleware,
  loginUserMiddleware,
};
=======
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
    
>>>>>>> 46c358a8a48fbca4e453ef957635a39998f6cc88
