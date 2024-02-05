const { UserModel, validateUser } = require("../models/userModel")
const bcrypt = require("bcrypt")

const userCTRL = {
    getUser: (req, res) => {
        try {
            res.json({ msg: "cant get users" })
        }
        catch (err) {
            console.log(err);
            res.status(502).json({ err })
        }
    },

    registerUser: async (req, res) => {
        const validate = validateUser(req.body, req.url)
        if (validate.error) {
            return res.status(400).json(validate.error.details)
        }
        try {
            const user = new UserModel(req.body)
            user.password = await bcrypt.hash(req.body.password, 10);
            await user.save()
            user.password = "********";
            return res.status(201).json(user);
        }
        catch (err) {
            console.log(err);
            res.status(502).json({ err })
        }

    },
    loginUser: async (req, res) => {
        const validate = validateUser(req.body, req.url)
        if (validate.error) {
            return res.status(400).json(validate.error.details)
        }
        const { password, email } = req.body
        try {
            const user = await UserModel.findOne({ email })

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ err: "password is incorrect" })
            }
            user.password = "********"
            res.status(200).json(user)
        }
        catch (err) {
            console.log(err);
            res.status(502).json({ err })
        }

    }
}

module.exports = userCTRL;