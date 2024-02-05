const mongoose = require("mongoose")

const main = async () => {
    await mongoose.connect("mongodb+srv://Netanel_admin:Segal1528@cluster0.a7uv2mp.mongodb.net/shiran")
    console.log("mongo connected");
}

main().catch(e => console.log(e))

