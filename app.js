const path = require('path')
const cors = require("cors")
const express = require('express')
const mainRoute = require('./routes/indexRoute')
const cookieParser = require("cookie-parser");
const app = express()

require("./db/dbConnect")

app.use(cors({
    origin: ["https://shiran-website.onrender.com"],
    credentials: true
}))

app.use('/assets', express.static(path.join(__dirname, 'public/uploads')));
app.use(cookieParser())
app.use(express.json())
app.use(mainRoute)

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})