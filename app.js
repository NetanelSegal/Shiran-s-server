const path = require('path')
const fileUpload = require("express-fileupload")
const cors = require("cors")
const express = require('express')
const mainRoute = require('./routes/indexRoute')
const cookieParser = require("cookie-parser");
const app = express()
require("./db/dbConnect")

app.use(cors({
    origin: true,
    credentials: true
}))
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(cookieParser())
app.use(express.json())
app.use('/assets', express.static(path.join(__dirname, 'public/upload')));
app.use(mainRoute)

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})