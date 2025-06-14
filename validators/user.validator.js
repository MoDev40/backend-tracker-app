const Joi = require("joi");

const  registerValidator = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required()
})

const loginValidator = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
})

module.exports = {
    registerValidator,
    loginValidator
}