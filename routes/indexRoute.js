const express = require('express')
const router = express.Router()
const usersRoute = require("./usersRoute")
const projectsRoute = require("./projectsRoute")
const categoriesRoute = require("./categoriesRoute")

router.use("/projects", projectsRoute)
router.use("/categories", categoriesRoute)
router.use("/users", usersRoute)
router.use("/", (_, res) => res.json({ msg: "index route working" }))

router.use((err, _, res, __) => {
    const errorObject = {};
    if (err.stack) errorObject.stack = err.stack;
    errorObject.message = err.message ?? "There was an error";
    console.error(errorObject);
    return res.status(err.status ?? 500).json(errorObject);
})

module.exports = router