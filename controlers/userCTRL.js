require("dotenv").config()
const { UserModel, validateUser } = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userCTRL = {
    registerUser: async ({ body, url }, res, next) => {
        const validate = validateUser(body, url)
        if (validate.error) {
            return next({ status: 400, stack: validate.error.details })
        }

        try {
            const user = new UserModel(body)
            user.password = await bcrypt.hash(body.password, 10);
            await user.save()
            user.password = "********";
            return res.status(201).json(user);
        }
        catch (err) {
            if (err.code == 11000) {
                return next({ status: 403, message: "Email already exist", stack: err })
            }
            next({ stack: err })
        }
    },
    loginUser: async ({ body, url }, res, next) => {
        const validate = validateUser(body, url)
        if (validate.error) {
            return next({ status: 400, stack: validate.error.details })
        }
        try {
            const user = await UserModel.findOne({ email: body.email })
            if (!user) {
                return next({ status: 404, message: "Email is not registered" })
            }
            if (!await bcrypt.compare(body.password, user.password)) {
                return next({ status: 401, message: "Password is incorrect" })
            }
            user.password = "********"
            const token = jwt.sign({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
                process.env.TOKEN_KEY, { expiresIn: "30d" })
            res.cookie("token", token).status(200).json({ user: user, message: "user logged in successfully", token: token })
        }
        catch (err) {
            next({ stack: err })
        }
    },
    getUser: async ({ user: tokenUser }, res, next) => {
        try {
            const user = await UserModel.findOne({ _id: tokenUser._id })
            user.password = "********"
            res.status(200).json(user)
        } catch (err) {
            next({ stack: err })
        }
    }
}


module.exports = userCTRL;