const jwt = require("jsonwebtoken")
require("dotenv").config()

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            next({ status: 400, message: "no token" })
        }
        req.user = jwt.verify(token, process.env.TOKEN_KEY);
        next();
    } catch (error) {
        next({ status: 401, stack: error, message: "unauthorized" })
    }
}

module.exports = { auth }