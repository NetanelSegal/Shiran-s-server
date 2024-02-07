const express = require('express')
const router = express.Router()
const { getUser, registerUser, loginUser } = require("../controlers/userCTRL")
const { auth } = require("../middlewares/auth")

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/checkAuth", auth, getUser)

module.exports = router