const mongoose = require("mongoose")
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    role: { type: String, default: "user" }
}, { timestamps: true })

const UserModel = mongoose.model('users', userSchema);

const joiRegisterSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).max(16).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    email: Joi.string().email().required()
})

const joiLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(16).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
})

const validateUser = (body, route) => {
    if (route.slice(1) == "login") {
        return joiLoginSchema.validate(body)
    }
    return joiRegisterSchema.validate(body)
}

module.exports = { UserModel, validateUser };