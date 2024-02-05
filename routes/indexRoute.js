const express = require('express')
const router = express.Router()
const usersRoute = require("./usersRoute")
// middleware that is specific to this router

router.use("/users", usersRoute)
router.use("/", (req, res) => res.json({ msg: "index route working" }))


module.exports = router