const jwt = require("jsonwebtoken")
require("dotenv").config()

const auth = (req, _, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            next({ status: 400, message: "Token invalide or expiered" })
        }
        req.user = jwt.verify(token, process.env.TOKEN_KEY);
        next();
    } catch (err) {
        next({ status: 401, stack: err, message: "unauthorized" })
    }
}

const authAdmin = ({ user }, _, next) => {
    if (user.role != "admin" && user.role != "developer") {
        return next({ status: 401, message: "You need to be an admin to add projects" })
    }
    next()
}

module.exports = { auth, authAdmin }