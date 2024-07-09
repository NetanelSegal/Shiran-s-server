const mongoose = require("mongoose")
require("dotenv").config()

const main = async () => {
    await mongoose.connect(process.env.DB_CONNECTION)
    console.log("mongo connected");
}

main().catch(e => console.error(e))