const express = require('express')
const router = express.Router()
const { getUser, registerUser, loginUser } = require("../controlers/userCTRL")

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/", getUser)

module.exports = router