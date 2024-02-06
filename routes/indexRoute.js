const express = require('express')
const router = express.Router()
const usersRoute = require("./usersRoute")
// middleware that is specific to this router

router.use("/users", usersRoute)
router.use("/", (_, res) => res.json({ msg: "index route working" }))

router.use((err, _, res, _) => {
    console.error(err);
    const errorObject = {};
    if (err.stack) errorObject.stack = err.stack;
    errorObject.message = err.message ?? "internal error";
    // if (process.env.MODE == "production") {
    //     errorObject.message = "internal error"
    //     delete errorObject.stack;
    // }
    return res.status(err.status ?? 500).json(errorObject)
})

module.exports = router