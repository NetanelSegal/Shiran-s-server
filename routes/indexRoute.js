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
    errorObject.stack = err.stack || "no stack";
    errorObject.message = err.message || "There was an error";
    const status = err.status || 500;
    console.log(errorObject);
    return res.status(status).json(errorObject);
});


module.exports = router